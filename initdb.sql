CREATE DATABASE IF NOT EXISTS ${DB_DATABASE}
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_0900_ai_ci;  -- general-purpose, Unicode 9.0 collation
USE ${DB_DATABASE};
CREATE USER IF NOT EXISTS '${DB_USER}'@'%' IDENTIFIED BY '${DB_PASSWORD}';
GRANT ALL PRIVILEGES ON ${DB_DATABASE}.* TO '${DB_USER}'@'%';
FLUSH PRIVILEGES;

-- 0) RequestLogs
CREATE TABLE IF NOT EXISTS requests (
    id INT NOT NULL AUTO_INCREMENT,
    timestamp DATETIME NOT NULL,
    ip VARCHAR(45) NOT NULL,
    method VARCHAR(10) NOT NULL,
    url TEXT NOT NULL,
    userAgent TEXT NULL,
    referrer TEXT NULL,
    status INT NOT NULL,
    contentLength INT NOT NULL,
    PRIMARY KEY (id)
);

-- 1) Users
CREATE TABLE users (
  id                BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
  email             VARCHAR(320)     NOT NULL,                          -- raw email as given
  email_normalized  VARCHAR(320)     GENERATED ALWAYS AS (LOWER(email)) STORED,
  password_hash     VARCHAR(255)     NOT NULL,                          -- e.g., Argon2id PHC string
  display_name      VARCHAR(100)     COLLATE utf8mb4_0900_as_cs NOT NULL,
  role              ENUM('youth','company','admin') NOT NULL DEFAULT 'youth',
  email_verified_at DATETIME         NULL,
  last_login_at     DATETIME         NULL,
  failed_logins     INT UNSIGNED     NOT NULL DEFAULT 0,
  locked_until      DATETIME         NULL,
  created_at        TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email_norm (email_normalized)  -- case-insensitive uniqueness
) ENGINE=InnoDB;

-- 2) Sessions
CREATE TABLE sessions (
  sid           BINARY(32)      NOT NULL,            -- 256-bit random
  user_id       BIGINT UNSIGNED NOT NULL,
  csrf_secret   BINARY(32)      NOT NULL,            -- per-session CSRF secret
  created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen_at  TIMESTAMP       NULL     DEFAULT NULL,
  expires_at    TIMESTAMP       NOT NULL,
  ip_address    VARBINARY(16)   NULL,                -- IPv4 or IPv6 (INET6_ATON in app)
  user_agent    VARCHAR(255)    NULL,
  PRIMARY KEY (sid),
  KEY idx_sessions_user (user_id),
  KEY idx_sessions_expires (expires_at),
  CONSTRAINT fk_sessions_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Email verification tokens (store only a hash, never raw token)
CREATE TABLE email_verification_tokens (
  user_id     BIGINT UNSIGNED NOT NULL,
  token_hash  VARCHAR(12)      NOT NULL,
  created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at  TIMESTAMP       NOT NULL,
  PRIMARY KEY (user_id, token_hash),
  UNIQUE KEY uq_email_verify_token (token_hash),
  CONSTRAINT fk_evt_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Password reset tokens (also hashed)
CREATE TABLE password_reset_tokens (
  user_id     BIGINT UNSIGNED NOT NULL,
  token_hash  BINARY(32)      NOT NULL,
  created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at  TIMESTAMP       NOT NULL,
  used_at     TIMESTAMP       NULL,
  PRIMARY KEY (user_id, token_hash),
  UNIQUE KEY uq_pwreset_token (token_hash),
  CONSTRAINT fk_prt_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

