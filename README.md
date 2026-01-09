# 팝콘 리포트 (Popcorn Report) 블로그

영화 속 숨은 디테일, 밤새워 얻어낸 게임 공략, 그리고 여권에 도장 찍히는 설렘이 가득한 여행기를 리포트 형식으로 기록하는 공간

## 기술 스택

- **Eleventy** - 정적 사이트 생성기
- **Tailwind CSS** - CSS 프레임워크
- **Nunjucks** - 템플릿 엔진
- **Prism.js** - 코드 하이라이팅

## 주요 기능

- ✅ 다국어 지원 (한국어/영어)
- ✅ 반응형 디자인
- ✅ SEO 최적화
- ✅ 코드 하이라이팅
- ✅ 카테고리 및 태그 시스템
- ✅ 페이지네이션
- ✅ 다크 모드 지원 (테마 시스템)

## 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:8080` 접속

### 빌드

```bash
npm run build
```

## 포스트 작성

### 기본 구조

`src/posts` 폴더 또는 하위 디렉토리에 마크다운 파일을 생성하세요:

```markdown
---
layout: post.njk
title: 포스트 제목
description: 포스트 설명 (150자 이내 권장)
date: 2025-01-15
category: Frontend
tags:
  - javascript
  - react
readingTime: 5
thumbnail: https://example.com/image.jpg
draft: false
---

# 포스트 내용

여기에 내용을 작성하세요...
```

### Front Matter 필드 설명

- `layout`: 레이아웃 템플릿 (post.njk 사용)
- `title`: 포스트 제목 (필수)
- `description`: 포스트 설명 (SEO 및 카드에 표시)
- `date`: 발행일 (YYYY-MM-DD 형식)
- `category`: 카테고리 (Frontend, Backend, Modeling, NoSQL, DevOps, AI/ML)
- `tags`: 태그 배열
- `thumbnail`: 썸네일 이미지 URL (선택)
- `draft`: 초안 여부 (true면 프로덕션에서 제외)
- `lang`: 포스트 언어 (`ko` 또는 `en`, 기본값: `ko`)

**참고:** `readingTime`은 자동으로 계산되므로 입력하지 않아도 됩니다.

### 디렉토리 구조

포스트가 많아지면 연도별, 카테고리별로 정리할 수 있습니다:

```
src/posts/
├── 2024/
│   ├── post-1.md
│   └── post-2.md
├── 2025/
│   ├── january/
│   │   └── post-3.md
│   └── post-4.md
└── drafts/
    └── draft-post.md
```

모든 하위 디렉토리의 `.md` 파일이 자동으로 인식됩니다.

### Thumbnail 이미지

**외부 이미지 사용:**
```yaml
thumbnail: https://images.unsplash.com/photo-xxx
```

**로컬 이미지 사용:**
```yaml
thumbnail: /assets/images/my-image.jpg
```

**권장 사양:**
- 비율: 16:9 (예: 1600x900px)
- 최소 크기: 800x450px
- 용량: 500KB 이하

### Draft (초안) 기능

작성 중인 포스트는 `draft: true`로 설정:

```yaml
---
title: 작성 중인 포스트
draft: true
---
```

- 로컬 개발(`npm run dev`): 보임 ✅
- 프로덕션 빌드(`npm run build`): 제외됨 ❌

## 페이지 작성

`src/pages` 폴더에 마크다운 파일을 생성하세요:

```markdown
---
layout: page.njk
title: 페이지 제목
description: 페이지 설명
permalink: /custom-page/
---

# 페이지 내용

여기에 내용을 작성하세요...
```

## 설정

### 환경 변수 설정 (권장)

민감한 정보는 환경 변수로 관리하세요:

1. `.env` 파일 생성:
```bash
cp .env.example .env
```

2. `.env` 파일 수정:
```env
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
ADSENSE_ENABLED=true
ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
ADSENSE_SLOT_IN_ARTICLE=1234567890
ADSENSE_SLOT_DISPLAY=0987654321
UTTERANCES_ENABLED=true
UTTERANCES_REPO=username/repository
```

### 또는 site.json 사용

`src/_data/site.json` 파일에서 직접 설정:

```json
{
  "googleAnalytics": "G-XXXXXXXXXX",
  "adsense": {
    "enabled": true,
    "client": "ca-pub-XXXXXXXXXXXXXXXX",
    "slots": {
      "inArticle": "1234567890",
      "display": "0987654321"
    }
  },
  "utterances": {
    "enabled": true,
    "repo": "username/repository"
  },
  "author": {
    "name": "이름",
    "bio": "소개",
    "github": "https://github.com/username",
    "avatar": "/assets/author.jpg"
  }
}
```

**참고:** 환경 변수가 설정되면 `site.json`보다 우선 적용됩니다.

## 카테고리

기본 카테고리:
- Frontend
- Backend
- Modeling
- NoSQL
- DevOps
- AI/ML

카테고리를 추가하려면 `src/_includes/sidebar.njk`와 `src/categories.njk` 파일을 수정하세요.

## 다국어 지원

이 블로그는 한국어와 영어를 지원합니다.

### 포스트에 언어 지정

포스트의 front matter에 `lang` 필드를 추가하세요:

```yaml
---
title: "My Post Title"
lang: en  # 또는 "ko" (기본값)
---
```

### 언어별 컬렉션

- `collections.blog_ko`: 한국어 포스트만
- `collections.blog_en`: 영어 포스트만
- `collections.blog`: 모든 언어 포스트

### 언어 전환

사용자는 헤더의 언어 전환 버튼으로 한국어/영어를 전환할 수 있습니다. 선택한 언어는 localStorage에 저장되어 다음 방문 시에도 유지됩니다.

자세한 내용은 [POST-CREATION-GUIDE.md](./POST-CREATION-GUIDE.md)의 "다국어 지원" 섹션을 참조하세요.

## 배포

### Netlify

1. GitHub에 저장소 푸시
2. Netlify에서 새 사이트 생성
3. 빌드 설정:
   - Build command: `npm run build`
   - Publish directory: `_site`
4. 환경 변수 설정 (Site settings > Environment variables)

자세한 내용은 [DEPLOYMENT.md](./DEPLOYMENT.md) 참조

## 문서

- [README.md](./README.md) - 프로젝트 개요 (현재 문서)
- [QUICKSTART.md](./QUICKSTART.md) - 빠른 시작 가이드
- [SETUP.md](./SETUP.md) - 상세 설정 가이드
- [DEPLOYMENT.md](./DEPLOYMENT.md) - 배포 및 환경 변수 가이드
- [MONETIZATION.md](./MONETIZATION.md) - 수익화 가이드 (Analytics, AdSense)
- [SEO.md](./SEO.md) - SEO 최적화 및 검색 엔진 등록 가이드
- [CHANGELOG.md](./CHANGELOG.md) - 변경 사항

## 라이선스

MIT
