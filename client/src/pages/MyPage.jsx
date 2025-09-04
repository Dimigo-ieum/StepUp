import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Container, Box, Typography, Paper, Tabs, Tab, Chip, Stack, Divider, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { mockCompletedProjects } from '../data/mockUserActivity'; // 1. Canvas에 있는 mock 데이터를 import 합니다.

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

// 완료된 프로젝트 카드 하나를 렌더링하는 컴포넌트
function CompletedProjectCard({ project }) {
    return (
        <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
            <Stack spacing={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" fontWeight="bold">{project.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{project.completedDate}</Typography>
                </Box>
                <Typography variant="body1">기업: {project.company}</Typography>
                <Typography variant="body1" fontWeight="bold">보상: {project.budget.toLocaleString()}원</Typography>
                <Box sx={{ pt: 1 }}>
                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                        "{project.review}" (평점: {project.rating})
                    </Typography>
                </Box>
            </Stack>
        </Paper>
    );
}


export default function MyPage() {
    const { user } = useAuth();
    const [tabValue, setTabValue] = useState(0);
    const [myCompletedProjects, setMyCompletedProjects] = useState([]);

    // 2. 로그인한 사용자의 완료된 프로젝트 목록을 필터링합니다.
    useEffect(() => {
        if (user && user.userType === 'youth') {
            const filteredProjects = mockCompletedProjects.filter(p => p.ownerId === user.id);
            setMyCompletedProjects(filteredProjects);
        }
    }, [user]); // user 정보가 바뀔 때마다 다시 필터링

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    if (!user) {
        return (
            <Container sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="h5">로그인이 필요한 서비스입니다.</Typography>
                <Button component={Link} to="/login" variant="contained" sx={{ mt: 2 }}>
                    로그인 페이지로 이동
                </Button>
            </Container>
        );
    }

    const youthTabs = ["지원한 프로젝트", "진행중 프로젝트", "완료한 프로젝트"];
    const companyTabs = ["등록한 프로젝트", "지원자 관리"];

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                마이페이지
            </Typography>

            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                {user.userType === 'youth' ? (
                    <Stack spacing={1}><Typography variant="h5" fontWeight="bold">{user.name}</Typography><Typography color="text.secondary">{user.email}</Typography><Typography color="text.secondary">전공: {user.major}</Typography><Stack direction="row" spacing={1} sx={{ mt: 1 }}>{user.skills.map(skill => <Chip key={skill} label={skill} />)}</Stack></Stack>
                ) : (
                    <Stack spacing={1}><Typography variant="h5" fontWeight="bold">{user.companyName}</Typography><Typography color="text.secondary">{user.email}</Typography><Typography color="text.secondary">담당자: {user.name}</Typography></Stack>
                )}
            </Paper>

            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabValue} onChange={handleTabChange}>
                        {(user.userType === 'youth' ? youthTabs : companyTabs).map(tabName => (
                            <Tab label={tabName} key={tabName} />
                        ))}
                    </Tabs>
                </Box>
                {user.userType === 'youth' ? (
                    <>
                        <TabPanel value={tabValue} index={0}><Typography>지원한 프로젝트 목록이 여기에 표시됩니다.</Typography></TabPanel>
                        <TabPanel value={tabValue} index={1}><Typography>현재 진행중인 프로젝트 목록이 여기에 표시됩니다.</Typography></TabPanel>
                        {/* 3. '완료한 프로젝트' 탭에 실제 데이터 목록을 렌더링합니다. */}
                        <TabPanel value={tabValue} index={2}>
                            {myCompletedProjects.length > 0 ? (
                                myCompletedProjects.map(project => <CompletedProjectCard key={project.id} project={project} />)
                            ) : (
                                <Typography>아직 완료한 프로젝트가 없습니다.</Typography>
                            )}
                        </TabPanel>
                    </>
                ) : (
                    <>
                        <TabPanel value={tabValue} index={0}><Typography>기업이 등록한 프로젝트 목록이 여기에 표시됩니다.</Typography></TabPanel>
                        <TabPanel value={tabValue} index={1}><Typography>프로젝트별 지원자 현황을 관리하는 UI가 여기에 표시됩니다.</Typography></TabPanel>
                    </>
                )}
            </Box>
        </Container>
    );
}

