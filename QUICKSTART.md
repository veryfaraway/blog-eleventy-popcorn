# 빠른 시작 가이드

## 1. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:8080` 접속

## 2. 첫 포스트 작성

`src/posts/my-first-post.md` 파일 생성:

```markdown
---
layout: post.njk
title: 나의 첫 포스트
description: 첫 번째 블로그 포스트입니다.
date: 2025-01-25
category: Frontend
tags:
  - blog
  - tutorial
thumbnail: https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=450&fit=crop
---

# 나의 첫 포스트

여기에 내용을 작성하세요!

## 코드 예제

\`\`\`javascript
console.log("Hello, World!");
\`\`\`

## 이미지 추가

![설명](/assets/images/my-image.jpg)
```

### 연도별 디렉토리 사용

포스트가 많아지면 디렉토리로 정리하세요:

```
src/posts/2025/my-first-post.md
```

### 초안(Draft) 작성

작성 중인 포스트는 `draft: true` 추가:

```yaml
---
title: 작성 중
draft: true
---
```

로컬에서는 보이지만 프로덕션 빌드에서는 제외됩니다.

## 3. 사이트 정보 수정

`src/_data/site.json` 파일 수정:

```json
{
  "title": "내 블로그",
  "googleAnalytics": "G-XXXXXXXXXX",
  "adsense": {
    "enabled": true,
    "client": "ca-pub-XXXXXXXXXXXXXXXX",
    "slots": {
      "inArticle": "1234567890",
      "display": "0987654321"
    }
  }
  "title": "내 블로그",
  "description": "내 블로그 설명",
  "url": "https://myblog.com",
  "author": {
    "name": "내 이름",
    "bio": "간단한 소개",
    "github": "https://github.com/myusername",
    "avatar": "/assets/author.jpg"
  }
}
```

## 4. 프로필 이미지 추가

`src/assets/author.jpg` 파일을 추가하세요.

## 5. 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 빌드 결과는 _site 폴더에 생성됩니다
```

## 주요 명령어

- `npm run dev` - 개발 서버 실행 (CSS watch + Eleventy serve)
- `npm run build` - 프로덕션 빌드
- `npm run build:css` - CSS만 빌드
- `npm run watch` - Eleventy watch 모드

## 폴더 구조

```
.
├── src/
│   ├── _data/          # 전역 데이터
│   ├── _includes/      # 재사용 컴포넌트
│   ├── _layouts/       # 레이아웃 템플릿
│   ├── assets/         # 이미지, 파일 등
│   ├── css/            # CSS 파일
│   ├── posts/          # 블로그 포스트
│   ├── about.md        # About 페이지
│   ├── blog.njk        # 블로그 목록
│   ├── categories.njk  # 카테고리 페이지
│   ├── index.njk       # 홈페이지
│   └── pages.njk       # 페이지 목록
├── _site/              # 빌드 결과물
├── .eleventy.js        # Eleventy 설정
├── tailwind.config.js  # Tailwind 설정
└── package.json        # 프로젝트 설정
```

## 다음 단계

1. [SETUP.md](./SETUP.md) - 상세 설정 가이드
2. [README.md](./README.md) - 전체 문서

## 문제 해결

### 포트가 이미 사용 중

다른 포트로 실행:
```bash
npx @11ty/eleventy --serve --port=8081
```

### CSS가 적용되지 않음

CSS 재빌드:
```bash
npm run build:css
```

### 변경사항이 반영되지 않음

캐시 삭제 후 재시작:
```bash
rm -rf _site
npm run dev
```
