import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Layout from './components/Layout';

// 페이지 컴포넌트들을 모두 import 합니다.
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyPage from './pages/MyPage';
import ProjectCreatePage from './pages/ProjectCreatePage';

// MUI 기본 테마 설정 (선택 사항)
const theme = createTheme();

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline /> {/* 브라우저마다 다른 기본 CSS를 초기화 */}
            <Routes>
                {/* Layout 컴포넌트 안에 있는 모든 페이지들은 공통적으로 Header를 가집니다. */}
                <Route path="/" element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path="projects" element={<ProjectsPage />} />
                    <Route path="projects/:projectId" element={<ProjectDetailPage />} />
                    <Route path="login" element={<LoginPage />} />
                    <Route path="register" element={<RegisterPage />} />
                    <Route path="mypage" element={<MyPage />} />
                    <Route path="/project/create" element={<ProjectCreatePage />} />
                </Route>
            </Routes>
        </ThemeProvider>
    );
}

export default App;

