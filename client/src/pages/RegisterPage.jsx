// src/pages/RegisterPage.jsx

import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Grid, ToggleButtonGroup, ToggleButton, Stack } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 1. useAuth 훅을 import 합니다.

const initialFormData = {
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    major: '',
    skills: '',
    companyName: '',
    businessNumber: '',
};

export default function RegisterPage() {
    const [userType, setUserType] = useState('youth');
    const [formData, setFormData] = useState(initialFormData);
    const { register } = useAuth(); // 2. AuthContext에서 register 함수를 가져옵니다.
    const navigate = useNavigate();

    const handleUserTypeChange = (event, newUserType) => {
        if (newUserType !== null) {
            setUserType(newUserType);
            setFormData(initialFormData);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        // 3. 제출할 사용자 데이터를 구성합니다.
        const submissionData = {
            userType,
            email: formData.email,
            password: formData.password, // 실제 앱에서는 비밀번호를 이렇게 다루면 안 됩니다!
            ...(userType === 'youth'
                ? {
                    name: formData.name,
                    major: formData.major,
                    skills: formData.skills.split(',').map(s => s.trim()).filter(s => s) // 빈 문자열 제거
                }
                : {
                    name: formData.companyName, // 기업회원의 경우 담당자 이름으로 name을 통일
                    companyName: formData.companyName,
                    businessNumber: formData.businessNumber
                })
        };

        // 4. register 함수를 호출하여 회원가입을 시도합니다.
        register(submissionData);
    };

    return (
        <Container component="main" maxWidth="sm">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5" fontWeight="bold">
                    회원가입
                </Typography>

                <ToggleButtonGroup
                    color="primary"
                    value={userType}
                    exclusive
                    onChange={handleUserTypeChange}
                    sx={{ mt: 3, mb: 2 }}
                >
                    <ToggleButton value="youth" sx={{ borderRadius: '16px' }} > 청년 회원</ToggleButton>
                    <ToggleButton value="company" sx={{ borderRadius: '16px' }}>기업 회원</ToggleButton>
                </ToggleButtonGroup>

                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
                    <Stack spacing={3}>
                        <TextField
                            required
                            fullWidth
                            id="email"
                            label="이메일 주소"
                            name="email"
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleChange}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
                        />
                        <TextField
                            required
                            fullWidth
                            name="password"
                            label="비밀번호"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                            value={formData.password}
                            onChange={handleChange}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
                        />
                        <TextField
                            required
                            fullWidth
                            name="confirmPassword"
                            label="비밀번호 확인"
                            type="password"
                            id="confirmPassword"
                            autoComplete="new-password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
                        />

                        {userType === 'youth' && (
                            <>
                                <TextField
                                    required
                                    fullWidth
                                    id="name"
                                    label="이름"
                                    name="name"
                                    autoComplete="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
                                />
                                <TextField
                                    required
                                    fullWidth
                                    id="major"
                                    label="전공"
                                    name="major"
                                    value={formData.major}
                                    onChange={handleChange}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
                                />
                                <TextField
                                    fullWidth
                                    id="skills"
                                    label="보유 기술 (쉼표로 구분)"
                                    name="skills"
                                    value={formData.skills}
                                    onChange={handleChange}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
                                />
                            </>
                        )}

                        {userType === 'company' && (
                            <>
                                <TextField
                                    required
                                    fullWidth
                                    id="companyName"
                                    label="기업명 (담당자명)"
                                    name="companyName"
                                    autoComplete="organization"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
                                />
                                <TextField
                                    required
                                    fullWidth
                                    id="businessNumber"
                                    label="사업자 등록번호"
                                    name="businessNumber"
                                    value={formData.businessNumber}
                                    onChange={handleChange}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
                                />
                            </>
                        )}

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 1, py: 1.5, fontSize: '1.1rem', borderRadius: '16px' }}
                        >
                            가입하기
                        </Button>
                    </Stack>

                    <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
                        <Grid item>
                            <RouterLink to="/login">
                                이미 계정이 있으신가요? 로그인
                            </RouterLink>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container >
    );
}
