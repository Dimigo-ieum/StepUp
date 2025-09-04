import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client'; // 1. 우리가 만든 API 클라이언트를 import 합니다.

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null); // 로그인한 사용자 정보 state
    const [csrfToken, setCsrfToken] = useState(null); // CSRF 토큰을 저장할 state
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태 (새로고침 시 깜빡임 방지)
    const navigate = useNavigate();

    // 앱이 처음 로드될 때, 서버에 세션 정보를 요청하여 로그인 상태를 확인합니다.
    useEffect(() => {
        const checkSession = async () => {
            try {
                // GET /auth/session API 호출
                const response = await apiClient.get('/api/auth/session');
                setUser(response.data.user); // 성공 시 사용자 정보 저장

                // 로그인 상태이므로, CSRF 토큰도 함께 요청
                const csrfResponse = await apiClient.get('/api/auth/csrf');
                setCsrfToken(csrfResponse.data.csrf_token);

            } catch (error) {
                // 세션이 유효하지 않은 경우 (401 Unauthorized 등)
                console.log("세션이 유효하지 않습니다.");
                setUser(null);
                setCsrfToken(null);
            } finally {
                setIsLoading(false); // 세션 확인이 끝나면 로딩 상태 해제
            }
        };
        checkSession();
    }, []);

    // 회원가입 함수 (API 연동)
    const register = async (userData) => {
        try {
            // POST /auth/signup API 호출
            await apiClient.post('/api/auth/signup', userData);
            alert('회원가입이 완료되었습니다. 이메일 인증 후 로그인해주세요.');
            navigate('/login');
        } catch (error) {
            console.error("회원가입 실패:", error);
            alert(error.response?.data?.error?.message || "회원가입 중 오류가 발생했습니다.");
        }
    };

    // 로그인 함수 (API 연동)
    const login = async (email, password) => {
        try {
            // POST /auth/login API 호출
            await apiClient.post('/api/auth/login', { email, password });

            // 로그인 성공 후, 세션 정보와 CSRF 토큰을 다시 가져옵니다.
            const sessionResponse = await apiClient.get('/api/auth/session');
            setUser(sessionResponse.data.user);

            const csrfResponse = await apiClient.get('/api/auth/csrf');
            setCsrfToken(csrfResponse.data.csrf_token);

            navigate('/');
        } catch (error) {
            console.error("로그인 실패:", error);
            alert(error.response?.data?.error?.message || "로그인에 실패했습니다.");
        }
    };

    // 로그아웃 함수 (API 연동)
    const logout = async () => {
        try {
            // POST /auth/logout API 호출
            await apiClient.post('/api/auth/logout');
        } catch (error) {
            console.error("로그아웃 실패:", error);
        } finally {
            // 실패 여부와 상관없이 프론트엔드 상태는 초기화
            setUser(null);
            setCsrfToken(null);
            navigate('/login');
        }
    };

    // Context를 통해 공유할 값들
    // apiClient에 CSRF 토큰을 자동으로 주입하는 인터셉터를 설정합니다.
    apiClient.interceptors.request.use(config => {
        if (csrfToken && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(config.method.toUpperCase())) {
            config.headers['X-CSRF-Token'] = csrfToken;
        }
        return config;
    }, error => Promise.reject(error));


    const value = { user, login, logout, register, isLoading };

    // 로딩 중일 때는 아무것도 렌더링하지 않아, 로그인 상태가 확인되기 전까지 화면 깜빡임을 방지합니다.
    if (isLoading) {
        return null; // 또는 로딩 스피너 컴포넌트를 보여줄 수 있습니다.
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Context를 쉽게 사용하기 위한 커스텀 Hook
export function useAuth() {
    return useContext(AuthContext);
}

