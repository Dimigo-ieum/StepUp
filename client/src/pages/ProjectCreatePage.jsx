import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, Stack } from '@mui/material';

export default function ProjectCreatePage() {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        skills: '',
        budget: '',
        period: '',
    });

    // 접근 제어 로직
    if (!user || user.userType !== 'company') {
        alert("프로젝트 등록은 기업 회원만 가능합니다.");
        return <Navigate to="/" replace />;
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const newProject = {
            ...formData,
            id: Date.now(),
            company: user.companyName,
            budget: parseInt(formData.budget) || 0,
            skills: formData.skills.split(',').map(s => s.trim()),
            applicants: 0,
        };
        console.log("새로운 프로젝트 데이터:", newProject);
        alert('프로젝트 등록이 완료되었습니다. (콘솔 확인)');
    };

    return (
        <Container component="main" maxWidth="md">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h4" fontWeight="bold">
                    새 프로젝트 등록
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
                    <Stack spacing={3}>
                        <TextField name="title" required fullWidth label="프로젝트 제목" value={formData.title} onChange={handleChange} />
                        <TextField name="description" required fullWidth multiline rows={6} label="상세 업무 내용" value={formData.description} onChange={handleChange} />
                        <TextField name="skills" required fullWidth label="요구 스킬 (쉼표로 구분)" value={formData.skills} onChange={handleChange} />
                        <TextField name="budget" required fullWidth label="예산 (숫자만 입력)" type="number" value={formData.budget} onChange={handleChange} />
                        <TextField name="period" required fullWidth label="예상 소요 기간 (예: 4주)" value={formData.period} onChange={handleChange} />
                        <Button type="submit" fullWidth variant="contained" size="large" sx={{ py: 1.5, fontSize: '1.1rem' }}>
                            프로젝트 등록하기
                        </Button>
                    </Stack>
                </Box>
            </Box>
        </Container>
    );
}

