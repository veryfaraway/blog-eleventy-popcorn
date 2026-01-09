# 변경 사항

## 2025-01-28 - 초기 레이아웃 및 템플릿 작업

### 추가된 기능

#### 디자인 & 스타일
- ✅ Tech Startup 색상 팔레트 적용 (파란색 + 노란색)
- ✅ 반응형 디자인 (모바일, 태블릿, 데스크톱)
- ✅ 커피 아이콘 로고 및 파비콘 제작
- ✅ 모던한 카드형 레이아웃

#### 레이아웃 & 템플릿
- ✅ `base.njk` - 기본 레이아웃 (SEO, Analytics 지원)
- ✅ `post.njk` - 블로그 포스트 레이아웃 (사이드바, Author, 댓글, 이전/다음글)
- ✅ `page.njk` - 문서 페이지 레이아웃
- ✅ `header.njk` - 네비게이션 (Home, Page, Blog, Categories, About)
- ✅ `footer.njk` - 푸터
- ✅ `sidebar.njk` - 사이드바 (최근 글, 카테고리, 태그 클라우드)
- ✅ `author.njk` - 작성자 소개 컴포넌트

#### 페이지
- ✅ 홈페이지 - 카드형 최근 포스트 (3열 그리드)
- ✅ 블로그 페이지 - 카드형 포스트 목록 (페이지당 12개)
- ✅ 카테고리 페이지
- ✅ Pages 페이지
- ✅ About 페이지

#### 기능
- ✅ 카테고리 시스템 (Frontend, Backend, Modeling, NoSQL, DevOps, AI/ML)
- ✅ 태그 시스템
- ✅ 페이지네이션
- ✅ 이전글/다음글 네비게이션
- ✅ 코드 하이라이팅 (Prism.js)
- ✅ 이미지 최적화
- ✅ SEO 최적화 (메타 태그, Open Graph)
- ✅ Google Analytics 연동 준비
- ✅ utterances 댓글 시스템 준비

#### 설정 파일
- ✅ `src/_data/site.json` - 사이트 전역 설정
- ✅ `.eleventy.js` - Eleventy 설정 (필터, 컬렉션)
- ✅ `tailwind.config.js` - Tailwind CSS 설정

#### 샘플 콘텐츠
- ✅ 샘플 포스트 (다양한 카테고리)
  - 인셉션 엔딩, 아직도 팽이만 보세요? 진짜 토템은 따로 있다!

#### 문서
- ✅ `README.md` - 프로젝트 개요 및 사용법
- ✅ `SETUP.md` - 상세 설정 가이드 (Analytics, AdSense, 댓글, 검색, 수식, 다이어그램)
- ✅ `QUICKSTART.md` - 빠른 시작 가이드
- ✅ `CHANGELOG.md` - 변경 사항 기록

### 기술 스택

- Eleventy 3.0.0
- Tailwind CSS 3.4.0
- Nunjucks (템플릿 엔진)
- Prism.js (코드 하이라이팅)
- Eleventy Image (이미지 최적화)

## 2025-01-29 - SEO 최적화 및 자동 기능

### 추가된 기능

#### SEO
- ✅ Sitemap 자동 생성 (`/sitemap.xml`)
- ✅ Robots.txt 자동 생성 (`/robots.txt`)
- ✅ Draft 포스트 sitemap에서 제외
- ✅ 우선순위 및 업데이트 빈도 자동 설정
- ✅ SEO 최적화 가이드 문서

#### 자동 계산
- ✅ 읽기 시간 자동 계산 (한글/영문 혼합 지원)
  - 한글: 500자/분
  - 영문: 200단어/분
  - Front Matter에 `readingTime` 입력 불필요

#### 문서
- ✅ `SEO.md` - 검색 엔진 등록 및 SEO 최적화 가이드

---

## 2025-01-29 - 환경 변수 지원 및 수익화 기능

### 추가된 기능

#### 환경 변수 지원
- ✅ `.env` 파일로 민감한 정보 관리
- ✅ Netlify 환경 변수 지원
- ✅ 환경 변수 우선순위 (환경 변수 > site.json)
- ✅ `src/_data/env.js` - 환경 변수 처리

#### Google Analytics & AdSense
- ✅ Google Analytics 자동 삽입
- ✅ Google AdSense 자동 광고 지원
- ✅ `{% adsense "inArticle" %}` - 인피드 광고 shortcode
- ✅ `{% adsense "display" %}` - 디스플레이 광고 shortcode
- ✅ 광고 활성화/비활성화 토글

#### 포스트 기능 개선
- ✅ 하위 디렉토리 지원 (`src/posts/**/*.md`)
- ✅ Thumbnail 이미지 지원 (외부 URL, 로컬 파일)
- ✅ Draft 기능 (로컬에서만 표시)
- ✅ 포스트 상단 Thumbnail 표시

#### 코드 하이라이팅 개선
- ✅ 언어별 구문 강조
- ✅ 코드 복사 버튼
- ✅ 언어 라벨 표시
- ✅ 다크 테마 코드 블록
- ✅ 토큰 색상 커스터마이징

#### 카테고리 & 태그
- ✅ 동적 카테고리 페이지 생성
- ✅ 동적 태그 페이지 생성
- ✅ 카테고리/태그별 포스트 필터링
- ✅ 포스트 개수 표시

#### 문서
- ✅ `DEPLOYMENT.md` - 배포 및 환경 변수 가이드
- ✅ `MONETIZATION.md` - 완전한 수익화 가이드
- ✅ `.env.example` - 환경 변수 템플릿

### 다음 단계 (선택사항)

- [ ] Pagefind 검색 기능 추가
- [ ] KaTeX 수학 수식 지원 (클라이언트 사이드)
- [ ] Mermaid 다이어그램 지원
- [ ] Chart.js 차트 지원
- [ ] RSS 피드 생성
- [ ] Sitemap 생성
- [ ] 다크 모드 (선택사항)
- [ ] 팔레트 9 (Smart Home) 색상 테마 추가

### 사용 방법

1. 개발 서버 실행: `npm run dev`
2. 포스트 작성: `src/posts/` 폴더에 마크다운 파일 추가
3. 설정 수정: `src/_data/site.json` 파일 수정
4. 빌드: `npm run build`
5. 배포: Netlify 또는 다른 호스팅 서비스 사용
