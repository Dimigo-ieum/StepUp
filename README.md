https://github.com/lanzarote0tr/StepUp

# Backend: API spec

This is a REST + Webhooks design that covers youth features, company features, shared chat/collab, reviews, and a safe escrow-style payments/settlement flow.

## Session based Authentication

Use a **server-side session cookie + CSRF token** instead of OAuth/JWT.

**Auth model**

- **Stateful session** stored server-side (e.g., DB/Redis).
- Browser receives `Set-Cookie: sid=<opaque>; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=<ttl>`.
- **Rotate `sid` on login and privilege changes** (session fixation defense). ([OWASP](https://owasp.org/www-community/attacks/Session_fixation?utm_source=chatgpt.com), [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html?utm_source=chatgpt.com))
- **CSRF protection**: require `X-CSRF-Token` on all state-changing requests (POST/PUT/PATCH/DELETE). Use **synchronizer token pattern** (server stores the token and validates). ([OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html?utm_source=chatgpt.com))
- If your SPA runs on a different eTLD+1/domain, set cookie **`SameSite=None; Secure`** and enable CORS with credentials. (Note: `None` **requires** `Secure`.) ([MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies?utm_source=chatgpt.com))

**Headers**

- `X-CSRF-Token: <csrf_token>` (required on state changes). ([OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html?utm_source=chatgpt.com))
- `Idempotency-Key: <uuid>` on money-moving POSTs and other non-safe POSTs. ([Stripe Docs](https://docs.stripe.com/api/idempotent_requests?utm_source=chatgpt.com), [Stripe](https://stripe.com/blog/idempotency?utm_source=chatgpt.com))
- `X-Request-Id: <uuid>` (traceability).

**Formats**

- UTC ISO-8601 timestamps; ISO-4217 currency codes; pagination `?page & page_size` or cursor `?after`. (unchanged)

### Endpoints

- `POST /auth/signup` `{email, password, role: "youth"|"company"}`
- `POST /auth/verify` `{token}`
- `POST /auth/login` → sets session cookie
    
    **Body:** `{ email, password }`
    
    **Response:** `200` + `Set-Cookie: sid=…; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=1209600`
    
- `POST /auth/token/refresh` `{refresh_token}`
- `POST /auth/logout` → invalidates session (`sid` revoked server-side)
- `GET /auth/session` → `{ user, roles, created_at, expires_at }` (for clients to introspect)
- `GET /auth/csrf` → `{ csrf_token }` (issue/refresh synchronizer token tied to session) ([OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html?utm_source=chatgpt.com))

---

- `GET /me` → profile; `PATCH /me` (name, avatar, timezone, locale)
- `POST /me/skills` `[{"name":"React","level":3}]`
- `POST /me/interests` `["web","security"]`
- `POST /me/certifications` `[{"issuer":"…","name":"…","id":"…"}]`
- `POST /files` (signed upload init) → `{upload_url, file_id}`

**Example: state-changing request**

```
POST /projects
X-CSRF-Token: j2W...        # from GET /auth/csrf
Idempotency-Key: 8b0c...    # for create/charge/refund/etc.

{ "title": "...", "budget": { "amount": 800000, "currency": "KRW" }, ... }

```

**Cookie settings (normative)**

- `HttpOnly` (blocks `document.cookie` access). ([OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html?utm_source=chatgpt.com), [OWASP](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/06-Session_Management_Testing/02-Testing_for_Cookies_Attributes?utm_source=chatgpt.com))
- `Secure` (TLS-only). (Defined by cookie spec.) ([IETF Datatracker](https://datatracker.ietf.org/doc/html/rfc6265?utm_source=chatgpt.com), [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie?utm_source=chatgpt.com))
- `SameSite=Lax` by default; use `None; Secure` only when cross-site is required. ([MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies?utm_source=chatgpt.com), [web.dev](https://web.dev/articles/samesite-cookies-explained?utm_source=chatgpt.com))
- **Regenerate session ID on login/priv-change** to prevent fixation. ([OWASP](https://owasp.org/www-community/attacks/Session_fixation?utm_source=chatgpt.com), [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html?utm_source=chatgpt.com))
- Reasonable idle + absolute timeouts (balance usability vs. sensitivity). ([OWASP](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/06-Session_Management_Testing/07-Testing_Session_Timeout?utm_source=chatgpt.com))

### OpenAPI deltas (cookie auth + CSRF)

```yaml
openapi: 3.1.0
components:
  securitySchemes:
    cookieAuth:
      type: apiKey
      in: cookie
      name: sid
    csrfHeader:
      type: apiKey
      in: header
      name: X-CSRF-Token
security:
  - cookieAuth: []
paths:
  /auth/login:
    post:
      requestBody:
        required: true
        content:
          application/json:
            schema: { type: object, required: [email, password],
                      properties: { email: {type: string, format: email}, password: {type: string} } }
      responses:
        '200': { description: "Set session cookie (sid)" }
  /auth/csrf:
    get:
      security: [ { cookieAuth: [] } ]
      responses:
        '200':
          description: CSRF token
          content:
            application/json:
              schema: { type: object, properties: { csrf_token: { type: string } } }

```

*(For state-changing endpoints, document requirement for `X-CSRF-Token` and include `csrfHeader` in their `security:` array.)*

### Reason using session instead of JWT

1. **Sid cookie + CSRF token is the standard pattern for stateful web apps** (OWASP CSRF guidance; synchronizer tokens for stateful). ([OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html?utm_source=chatgpt.com))
2. **Preventing attack:** `HttpOnly` against XSS cookie theft; `Secure` for TLS; `SameSite` to reduce CSRF. ([OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html?utm_source=chatgpt.com), [IETF Datatracker](https://datatracker.ietf.org/doc/html/rfc6265?utm_source=chatgpt.com), [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie?utm_source=chatgpt.com))
3. **Session ID rotation on login** mitigates session fixation. ([OWASP](https://owasp.org/www-community/attacks/Session_fixation?utm_source=chatgpt.com), [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html?utm_source=chatgpt.com))

> References: OWASP Session Management & CSRF Cheat Sheets; RFC 6265 / Set-Cookie; MDN SameSite; Stripe idempotency docs. (OWASP Cheat Sheet Series, IETF Datatracker, MDN Web Docs, Stripe Docs, Stripe)
> 

---

## Youth: projects, portfolio, growth

- `GET /projects/recommended` → personalized list (uses matching service)
- `POST /projects/{project_id}/apply` `{cover_letter, attachments:[file_id]}` (youth)
- `GET /portfolio/{user_id}`; `GET /me/portfolio` (mine)
- `GET /career/recommendations` → skills/certs to learn next
- `GET /career/roadmap?horizon_months=3` → milestone plan

**Auto-portfolio:** when an assignment is **approved**, system emits `assignment.approved` → portfolio entry is created.

---

## Company: projects & talent matching

- `POST /projects`
    
    ```
    {
      "title":"Data cleanup",
      "description":"…",
      "skills":["Python","Pandas"],
      "budget":{"amount": 800000, "currency":"KRW"},
      "duration_days":10,
      "slots":1,
      "visibility":"public"|"private"
    }
    ```
    
- `GET /projects?status=open|in_progress|closed`
- `PATCH /projects/{id}`
- `POST /projects/{id}/publish`
- `GET /projects/{id}/applicants` (company only)
- `POST /projects/{id}/assign` `{user_id}` (creates **assignment**)
- `POST /match/candidates` `{project_id}` → ranked youth list

---

## Execution workflow (both sides)

- `GET /assignments/{id}`
- `POST /assignments/{id}/deliverables` `{files:[file_id], note}` (youth uploads)
- `POST /assignments/{id}/submit` (moves to review)
- `POST /assignments/{id}/review` `{decision:"approve"|"request_changes", comment}` (company)
- `POST /assignments/{id}/dispute` `{reason, details}` (either side → moderation)

---

## Reviews, trust, verification

- `POST /assignments/{id}/feedback`
    
    `{rating:1..5, comment, private_note?}` (company→youth; optional youth→company)
    
- `GET /trust/{user_id}` → `{score, signals:{on_time_rate, avg_rating, repeat_hire_rate, dispute_ratio}}`
- `POST /verify/company` (business/KYB), `POST /verify/payouts` (youth KYC for payouts)

**Trust score (example)**

`score = w1*avg_rating + w2*on_time_rate + w3*repeat_hire - w4*dispute_ratio` (weights set server-side; recalculated nightly & on events)

---

## Chat & collaboration

- `POST /chats` `{participants:[user_id], subject?}`
- `GET /chats/{id}/messages`
- `POST /chats/{id}/messages` `{text, attachments?}`
- `POST /integrations/slack/connect` (OAuth)
    
    Webhook: `integration.message.created` (bridge messages if linked)
    

---

## Payments & settlement (escrow, safe)

**Flow (escrow, split fees):**

1. Company funds the assignment → money is **held**.
2. Youth submits; company approves → escrow **releases** to youth minus platform fee.
3. Refund path on rejection/dispute.

### Endpoints

- `POST /projects/{id}/payment-intents`
    
    `{amount, currency:"KRW", escrow:true, method:"card|bank_transfer|wallet"}`
    
    → `{payment_intent_id, client_secret, status:"requires_confirmation"}`
    
- `POST /payments/{payment_intent_id}/confirm` → `status:"succeeded|requires_action"`
- `POST /escrows/{assignment_id}/release` (company or auto on approval)
- `POST /escrows/{assignment_id}/refund` `{amount?}` (before release or via dispute)
- `GET /payouts?status=pending|paid` (youth)
- `POST /payouts/request` `{assignment_id}` (if manual trigger model)
- `GET /ledger/entries?entity_id=…` (auditable double-entry ledger view)

**Webhooks (payments)**

- `payment.succeeded`, `payment.failed`, `escrow.funded`, `escrow.released`, `refund.succeeded`, `payout.succeeded`, `dispute.opened|closed`

**Safety**

- Require `Idempotency-Key` on: payment-intents, confirm, release, refund, payouts.
- KYC/KYB before first payout; hold period configurable.

---

## Matching (AI)

- `POST /match/projects` `{user_id? (or profile payload)}` → ranked projects with **why**
- `POST /match/candidates` `{project_id}` → ranked youth with **why**

**Explainability fields (returned with matches):**

```
"explanations":[
  {"signal":"skill_overlap","weight":0.42},
  {"signal":"past_project_similarity","weight":0.31},
  {"signal":"company_feedback_fit","weight":0.12}
]

```

---

## Portfolio (auto & manual)

- `GET /portfolio/{user_id}`
- `POST /portfolio/entries` `{title, summary, links:[…], files:[file_id], from_assignment_id?}`

**Auto-create rule:** on `assignment.approved` → derive title, skills, metrics (duration, rating), attach deliverables; youth can **edit visibility**.

---

## Admin & moderation

- `GET /admin/disputes`
- `POST /admin/disputes/{id}/resolve` `{decision, notes}`
- `POST /admin/users/{id}/suspend`
- `GET /admin/metrics` (fraud signals, chargebacks, dispute rates)

---

## Events & webhooks (full list)

- User/profile: `user.created`, `user.verified`
- Project: `project.published`, `project.assigned`, `project.closed`
- Assignment: `assignment.submitted`, `assignment.approved`, `assignment.changes_requested`, `assignment.disputed`
- Portfolio: `portfolio.entry.created|updated`
- Payments: see above
- Career: `career.plan.updated` (AI recomputation finished)

`POST /webhooks/endpoints` to register; HMAC-SHA256 signature header `X-Webhook-Signature`.

---

## Errors & conventions

- Error body: `{"error":{"code":"string","message":"string","details":{}}}`
- Common codes: `validation_error`, `auth_failed`, `forbidden`, `not_found`, `insufficient_funds`, `kyc_required`, `idempotency_conflict`.

---

## Minimal OpenAPI seed (you can expand)

```yaml
openapi: 3.1.0
info: { title: Youth–Company Marketplace API, version: 1.0.0 }
paths:
  /projects:
    post:
      security: [ { bearerAuth: [] } ]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/NewProject'
      responses:
        '201': { description: Created }
  /projects/{id}/payment-intents:
    post:
      security: [ { bearerAuth: [] } ]
      parameters: [ { name: id, in: path, required: true, schema: { type: string } } ]
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/PaymentIntentCreate' }
      responses:
        '201': { description: Created }
components:
  securitySchemes:
    bearerAuth: { type: http, scheme: bearer, bearerFormat: JWT }
  schemas:
    NewProject:
      type: object
      required: [title, description, skills, budget, duration_days, slots]
      properties:
        title: { type: string }
        description: { type: string }
        skills: { type: array, items: { type: string } }
        budget:
          type: object
          properties: { amount: { type: integer }, currency: { type: string } }
        duration_days: { type: integer }
        slots: { type: integer }
        visibility: { type: string, enum: [public, private] }
    PaymentIntentCreate:
      type: object
      required: [amount, currency, escrow]
      properties:
        amount: { type: integer }
        currency: { type: string }
        escrow: { type: boolean }
        method: { type: string, enum: [card, bank_transfer, wallet] }

```

---

## Payment/Settlement “how to” (practical)

- **Use escrow by default** for all assignments; only allow direct pay for trivial non-deliverable tasks.
- **Integrate a PSP** that supports: card + bank transfer, KRW settlement, split payouts, refund APIs, and webhooks (e.g., global or local PSPs). Keep PSP behind a **payments service**; never expose PSP tokens to clients.
- **Double-entry ledger** in your DB:
    - Accounts: company_cash, platform_escrow, youth_receivable, platform_fee, refunds.
    - Every money move writes two balanced entries. This makes audits and disputes sane.
- **Payout guardrails**: KYC verified, bank account validated, 24–72h rolling reserve optional, velocity limits per user/day.

---

## Reasoning (why this shape)

1. **Direct mapping to your features**: youth recommendations, apply/execute/auto-portfolio, feedback→trust, career coach, company posting→matching→review→hire.
2. **Safety & leverage**: escrow + webhooks + idempotency stops double charges and clarifies the lifecycle; disputes are first-class.
3. **Explainable AI**: `explanations[]` prevents “black-box” recommendations and helps users trust the system.
4. **Growth loop**: approval → portfolio entry → higher trust → better matches.
5. **Integrability**: Slack-style chat integration and standard OAuth flows reduce friction.
6. **Auditability**: double-entry ledger + events = clean reconciliation and compliance readiness.
7. **Standards reduce ambiguity**: OAuth2/JWT for auth, ISO-8601/4217 for formats, HMAC-signed webhooks for reliability. **Sources:** OAuth 2.0 (RFC 6749), JWT (RFC 7519), ISO-8601 (date/time), ISO-4217 (currency codes), HMAC (FIPS 198-1).