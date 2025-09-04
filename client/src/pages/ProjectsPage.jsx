// src/pages/ProjectsPage.jsx
import React from 'react';
import { Typography, Box } from '@mui/material';

function ProjectsPage() {
    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                전체 프로젝트 목록
            </Typography>
            <Typography variant="body1">
                백엔드와 연동하여 등록된 프로젝트 리스트가 여기에 표시될 예정입니다.
            </Typography>
        </Box>
    );
}

export default ProjectsPage;