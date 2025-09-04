// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import LoginPage from './pages/LoginPage';

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
                    <Route path="login" element={<LoginPage />} />
                    {/* 여기에 새로운 페이지 라우트를 추가할 수 있습니다. */}
                </Route>
            </Routes>
        </ThemeProvider>
    );
}

export default App;