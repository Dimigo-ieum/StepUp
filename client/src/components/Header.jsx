import React from 'react';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
// ERROR FIX: 로고 파일 경로를 이전에 사용했던 파일로 수정합니다. 
// 만약 'Tlogo.svg' 파일이 'src/assets' 폴더에 있다면 이 경로를 다시 수정해주세요.
import logo from '../assets/Tlogo.svg';
import { useAuth } from '../context/AuthContext'; // 1. 인증 컨텍스트를 사용하기 위해 import 합니다.

export default function Header() {
    const { user, logout } = useAuth(); // 2. user 정보와 logout 함수를 가져옵니다.

    return (
        <AppBar
            position="fixed"
            elevation={0}
            sx={{
                // 사용자님이 작성하신 스타일은 그대로 유지됩니다.
                top: '16px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 'calc(100% - 32px)',
                maxWidth: '1200px',
                borderRadius: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.7)',
                boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.1)',
            }}
        >
            <Toolbar>
                {/* 로고 */}
                <Box sx={{ flexGrow: 1 }}>
                    <Link to="/">
                        <Box
                            component="img"
                            src={logo}
                            alt="Step Up Logo"
                            sx={{
                                height: 40,
                                verticalAlign: 'middle'
                            }}
                        />
                    </Link>
                </Box>

                {/* 3. 네비게이션 버튼들을 로그인 상태에 따라 다르게 보여줍니다. */}
                <Box>
                    <Button sx={{ color: '#000000' }} component={Link} to="/">
                        홈
                    </Button>
                    <Button sx={{ color: '#000000' }} component={Link} to="/projects">
                        프로젝트 목록
                    </Button>

                    {/* user 객체가 있으면(로그인 상태) 마이페이지와 로그웃 버튼을 보여줍니다. */}
                    {user ? (
                        <>
                            {/* TODO: 마이페이지 경로(/mypage)는 나중에 만들어야 합니다. */}
                            <Button sx={{ color: '#000000' }} component={Link} to="/mypage">
                                마이페이지
                            </Button>
                            <Button sx={{ color: '#FFFFFF', backgroundColor: '#FB6D4DFF', ml: '10px' }} onClick={logout}>
                                로그아웃
                            </Button>
                        </>
                    ) : (
                        // user 객체가 없으면(로그아웃 상태) 로그인 버튼을 보여줍니다.
                        <Button sx={{ color: '#FFFFFF', backgroundColor: '#465E97FF', ml: '10px' }} component={Link} to="/login">
                            로그인
                        </Button>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
}

