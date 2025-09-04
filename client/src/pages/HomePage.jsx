import React from 'react';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const backgroundImageUrl = 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1300';

export default function HomePage() {
    return (
        <Box
            sx={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: 'calc(100vh - 120px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Container maxWidth="md">
                <Stack spacing={4} alignItems="center" sx={{ textAlign: 'center' }}>
                    <Typography variant="h2" component="h1" fontWeight="bold" color="white">
                        당신의 다음 스텝, <br /> STEP UP에서 시작하세요.
                    </Typography>
                    <Typography variant="h6" color="grey.300" sx={{ maxWidth: '600px' }}>
                        기업의 성장을 이끌 새로운 인재, 청년의 잠재력을 펼칠 새로운 기회.
                        최고의 프로젝트와 최고의 인재가 만나는 곳.
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <Button variant="contained" size="large" component={Link} to="/projects" sx={{ px: 4, py: 1.5 }}>
                            프로젝트 둘러보기
                        </Button>
                        <Button variant="outlined" size="large" component={Link} to="#" sx={{ px: 4, py: 1.5, color: 'white', borderColor: 'white', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)', borderColor: 'white' } }}>
                            인재 찾아보기
                        </Button>
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );
}
