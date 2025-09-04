// src/pages/LoginPage.jsx

import * as React from 'react';
import { useState } from 'react';

// 로고, 아이콘, 추가 컴포넌트 import
import logo from '../assets/Tlogo.svg';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import { IconButton, InputAdornment } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import GoogleIcon from '@mui/icons-material/Google';
import Naver from '../assets/Naver.png';
import { useAuth } from '../context/AuthContext'; // 1. useAuth 훅을 import 합니다.


// 저작권 정보를 표시하는 컴포넌트 (수정 가능)
function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="#">
                STEP UP!
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}


export default function LoginPage() {
    const { login } = useAuth() // 2. AuthContext에서 login 함수를 가져옵니다.
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    // 3. 폼 제출 시 login 함수를 호출하도록 수정합니다.
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = data.get('email');
        const password = data.get('password');
        
        // login 함수 호출
        login(email, password);
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Box
                    component="img"
                    src={logo}
                    alt="Step Up Logo"
                    sx={{ height: 50, mb: 2 }}
                />
                <Typography component="h1" variant="h5">
                    로그인
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="이메일 주소"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '16px',
                            },
                        }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="비밀번호"
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        autoComplete="current-password"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '16px',
                            },
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="기억하기"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                            mt: 3,
                            mb: 2,
                            backgroundColor: '#4C6FAFFF',
                            '&:hover': {
                                backgroundColor: '#5162ACFF',
                            },
                            borderRadius: '8px',
                        }}

                    >
                        로그인
                    </Button>

                    <Divider sx={{ my: 2 }}>OR</Divider>
                    <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<GoogleIcon />}
                        sx={{ mb: 1, borderRadius: '8px' }}
                    >
                        Google 계정으로 로그인
                    </Button>
                    <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<img src={Naver} alt="네이버 로고" width="22px" />}
                        sx={{
                            color: '#2DB400',
                            '&:hover': { backgroundColor: '#F4FFF1FF' },
                            borderColor: '#2DB400',
                            borderRadius: '8px'
                        }}
                    >
                        Naver 계정으로 로그인
                    </Button>

                    <Grid container justifyContent="space-between" sx={{ mt: 2 }}>
                        <Grid item xs>
                            <Link href="#" variant="body2">
                                비밀번호를 잊으셨나요?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link component={RouterLink} to="/register" variant="body2">
                                {"계정이 없으신가요? 회원가입"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
    );
}
