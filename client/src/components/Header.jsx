// src/components/Header.jsx
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom'; // 페이지 이동을 위한 Link 컴포넌트
import logo from '../assets/Tlogo.svg';

function Header() {
    return (
        <AppBar
            position="fixed" // 화면 스크롤과 상관없이 상단에 고정
            elevation={0} // 기본 그림자 제거
            sx={{
                // 1. 플로팅 및 모양 설정
                top: '16px',                      // 상단에서 16px 띄웁니다.
                left: '50%',                      // 좌우 중앙 정렬을 위해 왼쪽에서 50% 이동
                transform: 'translateX(-50%)',   // 자신의 너비의 50%만큼 다시 왼쪽으로 이동하여 완벽한 중앙 정렬
                width: 'calc(100% - 32px)',       // 좌우 여백(16px * 2)을 주기 위해 너비 축소
                maxWidth: '1200px',               // 화면이 너무 넓어져도 헤더가 과하게 길어지는 것을 방지
                borderRadius: '16px',             // 모서리를 둥글게 만듭니다.

                // 2. 반투명 유리 효과 (Glassmorphism)
                backgroundColor: 'rgba(255, 255, 255, 0.5)', // 반투명한 흰색 배경
                backdropFilter: 'blur(8px)',                  // 헤더 뒤의 콘텐츠를 블러 처리
                WebkitBackdropFilter: 'blur(8px)',            // Safari 브라우저 호환성을 위함

                // 3. 은은한 테두리와 그림자 (선택 사항)
                border: '1px solid rgba(255, 255, 255, 0.7)',
                boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.1)',
            }}
        >
            <Toolbar>
                {/* 로고 또는 서비스 이름 */}
                <Box sx={{ flexGrow: 1 }}>
                    <Link to="/">
                        <Box
                            component="img"
                            src={logo} // import한 로고 변수를 src에 연결
                            alt="Step Up Logo" // 이미지가 표시되지 않을 때 나올 텍스트 (웹 접근성에 중요)
                            sx={{
                                height: 40, // 로고의 높이 (원하는 크기로 조절)
                                verticalAlign: 'middle' // 이미지가 약간 위로 뜨는 것을 방지
                            }}
                        />
                    </Link>
                </Box>

                {/* 네비게이션 버튼들 */}
                <Box>
                    <Button sx={{ color: '#000000' }} component={Link} to="/">
                        홈
                    </Button>
                    <Button sx={{ color: '#000000' }} component={Link} to="/projects">
                        프로젝트 목록
                    </Button>
                    <Button sx={{ color: '#000000' }} component={Link} to="/login">
                        로그인
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Header;