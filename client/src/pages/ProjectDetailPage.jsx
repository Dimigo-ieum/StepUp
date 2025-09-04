import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Grid, Paper, Button, Chip, Stack, Divider } from '@mui/material';
import { mockProjects } from '../data/mockProjects';

export default function ProjectDetailPage() {
    const { projectId } = useParams();
    const project = mockProjects.find(p => p.id === parseInt(projectId));

    if (!project) {
        return (
            <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h5">프로젝트를 찾을 수 없습니다.</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={5}>
                <Grid item xs={12} md={8}>
                    <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                        {project.title}
                    </Typography>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        {project.company}
                    </Typography>
                    <Divider sx={{ my: 3 }} />
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                        {project.description}
                    </Typography>
                    <Box sx={{ my: 4 }}>
                        <Typography variant="h6" gutterBottom>
                            필요 기술 스택
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            {project.skills.map((skill) => (
                                <Chip key={skill} label={skill} />
                            ))}
                        </Stack>
                    </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{ p: 3, position: 'sticky', top: 120 }}>
                        <Stack spacing={2}>
                            <Typography variant="h6" component="h3" fontWeight="bold">
                                프로젝트 요약
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body1" color="text.secondary">예상 보상</Typography>
                                <Typography variant="body1" fontWeight="bold">{project.budget.toLocaleString()}원</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body1" color="text.secondary">예상 기간</Typography>
                                <Typography variant="body1" fontWeight="bold">{project.period}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body1" color="text.secondary">현재 지원자</Typography>
                                <Typography variant="body1" fontWeight="bold">{project.applicants}명</Typography>
                            </Box>
                            <Button variant="contained" size="large" fullWidth sx={{ mt: 2 }}>
                                프로젝트 지원하기
                            </Button>
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}
