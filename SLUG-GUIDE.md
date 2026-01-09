# Slug 가이드

## Slug란?

**Slug**는 URL에 사용되는 친화적인 문자열입니다. 웹 주소를 읽기 쉽고 SEO에 유리하게 만듭니다.

### 예시

**제목:** "React Hooks 완벽 가이드"
**Slug:** `react-hooks-guide`
**URL:** `https://yourdomain.com/posts/react-hooks-guide/`

---

## 현재 프로젝트의 Slug 적용

### 1. 포스트 URL (자동 생성)

#### 파일명 기반 Slug
포스트의 URL은 **파일명**에서 자동으로 생성됩니다.

**예시:**
```
파일: src/posts/react-hooks-guide.md
URL: /posts/react-hooks-guide/

파일: src/posts/2025/mongodb-basics.md
URL: /posts/2025/mongodb-basics/
```

#### 규칙
- 파일명이 그대로 URL이 됨
- 확장자(.md) 제거
- 디렉토리 구조 유지

### 2. 카테고리 URL (slugify 필터 사용)

카테고리 이름은 `slugify` 필터로 변환됩니다.

**예시:**
```
카테고리: "AI/ML"
Slug: "ai-ml"
URL: /categories/ai-ml/

카테고리: "Frontend"
Slug: "frontend"
URL: /categories/frontend/
```

#### 적용 위치
- `src/categories-single.njk`
- `src/_layouts/post.njk`
- `src/_includes/sidebar.njk`
- `src/_includes/footer.njk`

**코드:**
```nunjucks
<a href="/categories/{{ category | slugify }}/">
  {{ category }}
</a>
```

### 3. 태그 URL (자동 소문자 변환)

태그는 자동으로 소문자로 변환됩니다.

**예시:**
```
태그: "JavaScript"
URL: /tags/javascript/

태그: "data-analysis"
URL: /tags/data-analysis/
```

---

## Slugify 필터 동작

Eleventy의 내장 `slugify` 필터는 다음과 같이 동작합니다:

### 변환 규칙
1. **소문자 변환**: `Frontend` → `frontend`
2. **공백을 하이픈으로**: `AI ML` → `ai-ml`
3. **특수문자 제거**: `AI/ML` → `ai-ml`
4. **연속 하이픈 제거**: `AI--ML` → `ai-ml`
5. **앞뒤 하이픈 제거**: `-frontend-` → `frontend`

### 예시
```javascript
"React Hooks Guide" → "react-hooks-guide"
"AI/ML" → "ai-ml"
"Node.js" → "nodejs"
"C++" → "c"
"데이터 분석" → "데이터-분석"
```

---

## 포스트 파일명 작성 가이드

### 권장 사항

#### ✅ 좋은 파일명
```
react-hooks-guide.md
mongodb-basics.md
python-data-analysis.md
nextjs-13-features.md
```

**특징:**
- 소문자 사용
- 하이픈으로 단어 구분
- 간결하고 명확
- 영문 사용 (한글 가능하지만 비권장)

#### ❌ 피해야 할 파일명
```
React Hooks Guide.md          # 공백 사용
react_hooks_guide.md          # 언더스코어 사용
리액트-훅스-가이드.md          # 한글 (URL에 인코딩됨)
post-1.md                     # 의미 없는 이름
```

### 파일명 작성 팁

1. **키워드 포함**: SEO를 위해 주요 키워드 포함
2. **간결하게**: 3-5 단어 정도
3. **날짜 제외**: 파일명에 날짜 넣지 않기 (Front Matter에 date 사용)
4. **영문 사용**: 한글은 URL 인코딩되어 복잡해짐

---

## 커스텀 Slug 사용

### Front Matter에서 permalink 지정

파일명과 다른 URL을 원하면 `permalink` 사용:

```yaml
---
layout: post.njk
title: React Hooks 완벽 가이드
permalink: /posts/react-hooks-complete-guide/
---
```

**결과:**
- 파일명: `react-hooks.md`
- URL: `/posts/react-hooks-complete-guide/`

### 동적 Slug 생성

제목 기반으로 자동 생성하려면:

```yaml
---
layout: post.njk
title: React Hooks 완벽 가이드
eleventyComputed:
  permalink: "/posts/{{ title | slugify }}/"
---
```

**결과:**
- URL: `/posts/react-hooks-완벽-가이드/`

---

## 한글 Slug 처리

### 현재 동작

한글은 URL 인코딩됩니다:

```
파일명: 리액트-훅스.md
URL: /posts/%EB%A6%AC%EC%95%A1%ED%8A%B8-%ED%9B%85%EC%8A%A4/
```

### 권장 방법

**방법 1: 영문 파일명 사용 (권장)**
```
파일명: react-hooks.md
제목: React Hooks 완벽 가이드
URL: /posts/react-hooks/
```

**방법 2: 커스텀 Slug 플러그인**

한글을 영문으로 변환하는 플러그인 설치:
```bash
npm install --save-dev transliteration
```

`.eleventy.js`에 추가:
```javascript
const { slugify } = require('transliteration');

eleventyConfig.addFilter("customSlug", function(str) {
  return slugify(str, {
    lowercase: true,
    separator: '-'
  });
});
```

사용:
```nunjucks
{{ title | customSlug }}
```

---

## SEO 최적화

### URL 구조 권장사항

#### ✅ 좋은 URL
```
/posts/react-hooks-guide/
/posts/mongodb-basics/
/categories/frontend/
/tags/javascript/
```

**특징:**
- 짧고 명확
- 키워드 포함
- 읽기 쉬움
- 계층 구조 명확

#### ❌ 피해야 할 URL
```
/posts/post-1/                    # 의미 없음
/posts/2025-01-15-react-hooks/    # 날짜 포함 (불필요)
/posts/react-hooks-guide-complete-tutorial-for-beginners/  # 너무 김
```

### URL 길이
- 권장: 3-5 단어
- 최대: 60자 이내
- 키워드 2-3개 포함

---

## 실전 예제

### 예제 1: 기본 포스트

**파일:** `src/posts/nextjs-app-router.md`

```yaml
---
layout: post.njk
title: Next.js 13 App Router 완벽 가이드
description: Next.js 13의 새로운 App Router 사용법
date: 2025-01-30
category: Frontend
tags:
  - nextjs
  - react
---
```

**결과:**
- URL: `/posts/nextjs-app-router/`
- 카테고리 URL: `/categories/frontend/`
- 태그 URL: `/tags/nextjs/`, `/tags/react/`

### 예제 2: 하위 디렉토리

**파일:** `src/posts/2025/docker-basics.md`

```yaml
---
layout: post.njk
title: Docker 기초부터 실전까지
category: DevOps
---
```

**결과:**
- URL: `/posts/2025/docker-basics/`
- 카테고리 URL: `/categories/devops/`

### 예제 3: 커스텀 Permalink

**파일:** `src/posts/short.md`

```yaml
---
layout: post.njk
title: 짧은 제목
permalink: /posts/comprehensive-guide-to-web-development/
---
```

**결과:**
- URL: `/posts/comprehensive-guide-to-web-development/`

---

## 문제 해결

### URL이 이상하게 생성됨

**문제:** `/posts/React%20Hooks/`

**원인:** 파일명에 공백 사용

**해결:**
```bash
# 파일명 변경
mv "React Hooks.md" "react-hooks.md"
```

### 한글 URL 인코딩

**문제:** `/posts/%ED%95%9C%EA%B8%80/`

**원인:** 한글 파일명

**해결:**
```bash
# 영문 파일명 사용
mv "한글.md" "hangul.md"
```

### 카테고리 URL 404

**문제:** `/categories/AI/ML/` 404 오류

**원인:** 슬래시(/) 포함

**해결:**
- 카테고리명: `AI/ML` → `AI-ML` 또는 `AIML`
- 또는 `slugify` 필터가 자동으로 `ai-ml`로 변환

---

## 체크리스트

### 새 포스트 작성 시
- [ ] 파일명은 영문 소문자 + 하이픈
- [ ] 파일명에 키워드 포함
- [ ] 파일명 길이 적절 (3-5 단어)
- [ ] 공백, 특수문자 사용 안 함
- [ ] 의미 있는 이름 사용

### URL 확인
- [ ] 포스트 URL 정상 작동
- [ ] 카테고리 URL 정상 작동
- [ ] 태그 URL 정상 작동
- [ ] 한글 인코딩 없음
- [ ] URL 길이 적절

---

## 참고 자료

- [Eleventy Slugify 문서](https://www.11ty.dev/docs/filters/slugify/)
- [URL 구조 SEO 가이드](https://developers.google.com/search/docs/crawling-indexing/url-structure)
- [Slug 작성 모범 사례](https://moz.com/learn/seo/url)
