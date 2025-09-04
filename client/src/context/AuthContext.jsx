import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// WARNING: 이것은 백엔드가 없는 데모용 Mock 인증입니다.
// 실제 프로덕션 환경에서는 절대 비밀번호를 localStorage에 저장해서는 안 됩니다.

// 1. Context 생성
const AuthContext = createContext(null);

// 2. Provider 컴포넌트 생성
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // 앱이 처음 로드될 때 localStorage에서 로그인된 사용자 정보를 가져와 state에 설정
    useEffect(() => {
        try {
            const loggedInUser = localStorage.getItem('step-up-user');
            if (loggedInUser) {
                setUser(JSON.parse(loggedInUser));
            }
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
            localStorage.removeItem('step-up-user');
        }
    }, []);

    // 회원가입 함수
    const register = (userData) => {
        const users = JSON.parse(localStorage.getItem('registered_users')) || [];

        if (users.some(u => u.email === userData.email)) {
            alert('이미 가입된 이메일입니다.');
            return false;
        }

        // --- 이 부분이 핵심적인 수정사항입니다 ---
        // 1. 새로 가입하는 유저를 위한 고유 ID를 생성합니다.
        const newUser = {
            ...userData,
            id: Date.now(), // 현재 시간을 기반으로 간단한 고유 ID 생성
        };
        // -----------------------------------------

        // 새 사용자 추가 (ID가 포함된 newUser 객체로 저장)
        users.push(newUser);
        localStorage.setItem('registered_users', JSON.stringify(users));

        // 회원가입 후 바로 로그인 처리
        localStorage.setItem('step-up-user', JSON.stringify(newUser));
        setUser(newUser);

        alert('회원가입이 완료되었습니다.');
        navigate('/');
        return true;
    };


    // 로그인 함수
    const login = (email, password) => {
        // localStorage에서 사용자 목록을 가져옴
        const users = JSON.parse(localStorage.getItem('registered_users')) || [];

        // 이메일과 비밀번호가 일치하는 사용자를 찾음
        const foundUser = users.find(u => u.email === email && u.password === password);

        if (foundUser) {
            // 로그인 성공 시, 사용자 정보를 state와 localStorage에 저장
            localStorage.setItem('step-up-user', JSON.stringify(foundUser));
            setUser(foundUser);
            navigate('/'); // 로그인 성공 후 홈으로 이동
        } else {
            alert("이메일 또는 비밀번호가 일치하지 않습니다.");
        }
    };

    // 로그아웃 함수
    const logout = () => {
        setUser(null); // 사용자 정보를 null로 바꿔서 로그아웃 처리
        localStorage.removeItem('step-up-user'); // localStorage에서 사용자 정보 제거
        navigate('/login'); // 로그아웃 후 로그인 페이지로 이동
    };

    // Context를 통해 공유할 값들
    const value = { user, login, logout, register };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 3. Context를 쉽게 사용하기 위한 커스텀 Hook
export function useAuth() {
    return useContext(AuthContext);
}