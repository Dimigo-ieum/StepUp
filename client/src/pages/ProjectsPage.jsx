import React from 'react';
import { Container, Grid, Typography, Box, TextField, FormControl, InputLabel, Select, MenuItem, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

//import { mockProjects } from '../data/mockProjects';
import { useProjects } from '../context/ProjectContext';
import ProjectCard from '../components/ProjectCard';

export default function ProjectsPage() {
    const { projects } = useProjects();
    return (
        <Container sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                전체 프로젝트
            </Typography>

            {/* 검색 및 필터링 UI */}
            <Box component="div" sx={{ mb: 4, display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="프로젝트명, 기술 스택 등으로 검색"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    // 1. 검색창 모서리를 둥글게 만듭니다.
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '16px',
                        },
                    }}
                />
                <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel>분야</InputLabel>
                    <Select
                        label="분야"
                        // 2. 분야 선택 메뉴 모서리를 둥글게 만듭니다.
                        sx={{
                            borderRadius: '16px',
                        }}
                    >
                        <MenuItem value="dev">개발</MenuItem>
                        <MenuItem value="design">디자인</MenuItem>
                        <MenuItem value="marketing">마케팅</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <Grid container spacing={4}>
                {projects.map((project) => (
                    <Grid item key={project.id} xs={12} sm={6} md={4} sx={{ display: 'flex' }}>
                        <ProjectCard project={project} />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

