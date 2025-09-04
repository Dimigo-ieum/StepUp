import React from 'react';
import { Card, CardContent, Typography, Button, Chip, Stack, Box } from '@mui/material';
import { Link } from 'react-router-dom';

export default function ProjectCard({ project }) {
    return (
        // 이 Card 컴포넌트에 sx prop을 사용하여 borderRadius를 추가합니다.
        <Card sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '16px', // <-- 이 줄을 추가하거나 값을 수정하세요. (예: '8px', '24px')
            flexGrow: 1,
        }}>
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2" fontWeight="bold">
                    {project.title}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    {project.company}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ my: 2, flexWrap: 'wrap', gap: 0.5 }}>
                    {project.skills.map((skill) => (
                        <Chip key={skill} label={skill} size="small" />
                    ))}
                </Stack>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: '2',
                        WebkitBoxOrient: 'vertical',
                    }}
                >
                    {project.description}
                </Typography>
            </CardContent>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" fontWeight="bold">
                    {project.budget.toLocaleString()}원
                </Typography>
                <Button
                    variant="contained"
                    component={Link}
                    to={`/projects/${project.id}`}
                >
                    상세보기
                </Button>
            </Box>
        </Card>
    );
}
