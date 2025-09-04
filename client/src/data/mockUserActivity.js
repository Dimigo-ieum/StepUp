// src/data/mockUserActivity.js

// 사용자가 완료한 프로젝트 목록에 대한 가짜 데이터입니다.
// ownerId는 AuthContext에서 로그인 시 생성되는 가짜 사용자의 id와 일치합니다.
export const mockCompletedProjects = [
    {
        id: 201,
        ownerId: 1756992787974, // '홍길동' (청년) 사용자의 id
        title: 'A-회사 소개서 영문 번역',
        company: 'A-컴퍼니',
        completedDate: '2025-08-15',
        budget: 300000,
        review: '꼼꼼하고 빠른 번역 감사합니다. 다음에 또 의뢰하고 싶습니다.',
        rating: 5,
    },
    {
        id: 202,
        ownerId: 1756992787974, // '홍길동' (청년) 사용자의 id
        title: 'B-쇼핑몰 이벤트 배너 디자인',
        company: 'B-커머스',
        completedDate: '2025-07-20',
        budget: 250000,
        review: '저희가 원하던 느낌을 정확히 캐치해서 디자인해주셨습니다. 만족스럽습니다.',
        rating: 4.5,
    },
    // 다른 사용자의 완료된 프로젝트 (필터링 테스트용)
    {
        id: 203,
        ownerId: 101, // '스텝업 채용담당자' (기업) 사용자의 id
        title: 'C-서비스 로고 리디자인',
        company: 'C-솔루션',
        completedDate: '2025-09-01',
        budget: 700000,
        review: '감각적인 로고 감사합니다.',
        rating: 5,
    },
];
