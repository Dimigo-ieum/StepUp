import axios from 'axios';

// 1. Axios 인스턴스 생성
const apiClient = axios.create({
    // 2. API 서버의 기본 URL을 설정합니다.
    // 백엔드 개발자 친구분께 API 서버 주소를 확인하여 이 부분을 수정해야 합니다.
    // 보통 로컬 개발 환경에서는 'http://localhost:3000'과 같은 형태가 됩니다.
    baseURL: 'http://localhost:3000/api', // <-- 백엔드 서버 주소로 변경 필요

    // 3. 쿠키를 자동으로 주고받기 위한 필수 설정입니다.
    // 이 설정을 통해 브라우저가 서버로부터 받은 세션 쿠키(sid)를
    // 모든 다음 요청에 자동으로 포함시켜 보냅니다.
    withCredentials: true,
});

/*
  4. CSRF 토큰 처리를 위한 인터셉터 (나중에 AuthContext에서 구현)
  
  apiClient.interceptors.request.use(config => {
    const csrfToken = // AuthContext 등에서 저장된 토큰 가져오기;
    if (csrfToken && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(config.method.toUpperCase())) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }
    return config;
  });
*/

export default apiClient;
