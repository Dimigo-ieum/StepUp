import React, { createContext, useState, useContext } from 'react';
import { mockProjects as initialProjects } from '../data/mockProjects'; // 1. 초기 데이터를 mock 데이터로 설정

// ProjectContext 생성
const ProjectContext = createContext(null);

// Provider 컴포넌트 생성
export function ProjectProvider({ children }) {
    // 2. 프로젝트 목록을 state로 관리합니다.
    const [projects, setProjects] = useState(initialProjects);

    // 3. 새 프로젝트를 목록에 추가하는 함수
    const addProject = (newProject) => {
        // 실제 앱에서는 이 함수가 백엔드 API를 호출합니다 (POST /projects)
        setProjects(prevProjects => [newProject, ...prevProjects]);
    };

    // Context를 통해 공유할 값
    const value = { projects, addProject };

    return (
        <ProjectContext.Provider value={value}>
            {children}
        </ProjectContext.Provider>
    );
}

// Context를 쉽게 사용하기 위한 커스텀 Hook
export function useProjects() {
    return useContext(ProjectContext);
}
