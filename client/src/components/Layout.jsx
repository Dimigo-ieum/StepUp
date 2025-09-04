// src/components/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import { Container, Box } from '@mui/material';

function Layout() {
    return (
        <Box>
            <Header />
            <Container component="main" sx={{ mt: '120px', mb: 4 }}>
                {/* 이 Outlet 부분에 각 페이지의 내용이 렌더링됩니다. */}
                <Outlet />
            </Container>
        </Box>
    );
}

export default Layout;