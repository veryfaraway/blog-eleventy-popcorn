# Slug 가이드

## 개요

블로그 포스트의 URL은 SEO 최적화를 위해 `slug` 필드를 기반으로 생성됩니다. 이 가이드는 slug 사용법과 모범 사례를 설명합니다.

## URL 생성 규칙

### 1. Slug 기반 URL (권장)

포스트의 front matter에 `slug` 필드가 있으면 해당 값을 사용합니다:

```yaml
---
title: "AI의 폭주와 할루시네이션"
slug: ai-visionary-movies-eagle-eye-i-robot
date: 2026-02-24
---
```

생성되는 URL: `/posts/2026/ai-visionary-movies-eagle-eye-i-robot/`

### 2. 파일명 기반 URL (Fallback)

`slug` 필드가 없으면 파일명에서 자동으로 생성됩니다:

- 파일명: `011-ai-visionary-movies.md`
- 숫자 prefix 자동 제거: `ai-visionary-movies`
- 생성되는 URL: `/posts/2026/ai-visionary-movies/`

## Slug 작성 규칙

### ✅ 좋은 예시

```yaml
slug: ai-visionary-movies-eagle-eye-i-robot
slug: rotten-tomatoes-guide
slug: japanese-spa-trip
```

### ❌ 나쁜 예시

```yaml
slug: 011-ai-movies  # 숫자 prefix 포함
slug: AI_Movies      # 대문자 및 언더스코어 사용
slug: 영화-리뷰      # 한글 사용 (URL 인코딩 문제)
```

## 모범 사례

1. **영문 소문자와 하이픈만 사용**: `my-awesome-post`
2. **의미 있는 키워드 포함**: SEO에 유리
3. **간결하게 유지**: 3-5개 단어 권장
4. **고유한 값 사용**: 중복 방지

## 중복 감지

빌드 시 중복된 permalink가 자동으로 감지됩니다:

```bash
⚠️  WARNING: Duplicate permalinks detected!
   - /posts/2026/inception-secret/
     → src/posts/2026/001-inception-secret.md
     → src/posts/2026/006-rotten-tomatoes.md
```

중복이 발견되면:
1. 콘솔에 경고 출력
2. `_site/permalink-duplicates.json` 파일 생성
3. GitHub Actions가 자동으로 Issue 생성

## 자동 리다이렉션

기존 URL(숫자 prefix 포함)에서 새 URL(slug 기반)로 자동 리다이렉션됩니다:

```
/posts/2026/011-ai-visionary-movies/ → /posts/2026/ai-visionary-movies/ (301)
```

리다이렉션 규칙은 `_site/_redirects` 파일에 자동 생성됩니다.

## 새 포스트 생성

`npm run new` 명령어를 사용하면 slug가 자동으로 생성됩니다:

```bash
npm run new
```

제목을 입력하면 자동으로:
- slug 생성
- 파일명 생성 (숫자 prefix 없이)
- front matter에 slug 추가

## 문제 해결

### 중복 Slug 발견 시

1. GitHub Issues에서 자동 생성된 이슈 확인
2. 중복된 포스트의 slug를 고유한 값으로 변경
3. 재빌드 후 확인

### URL이 변경되지 않을 때

1. 빌드 캐시 삭제: `rm -rf _site`
2. 재빌드: `npm run build`
3. slug 필드가 올바른지 확인

## 참고사항

- slug는 한 번 설정하면 변경하지 않는 것이 좋습니다 (SEO 영향)
- 변경이 필요한 경우 리다이렉션 규칙을 수동으로 추가하세요
- 다국어 포스트는 `lang` 파라미터가 자동으로 추가됩니다

## SEO 최적화

### URL 구조 권장사항

#### ✅ 좋은 URL

```text
/posts/2026/react-hooks-guide/
/posts/2026/mongodb-basics/
```

**특징:**

- 짧고 명확
- 키워드 포함
- 읽기 쉬움
- 숫자 prefix 없음

#### ❌ 피해야 할 URL

```text
/posts/2026/001-post/                    # 숫자 prefix
/posts/2026/post-1/                      # 의미 없음
/posts/2026/react-hooks-guide-complete-tutorial-for-beginners/  # 너무 김
```

### URL 길이

- 권장: 3-5 단어
- 최대: 60자 이내
- 키워드 2-3개 포함

---

## 참고 자료

- [Eleventy 공식 문서](https://www.11ty.dev/)
- [URL 구조 SEO 가이드](https://developers.google.com/search/docs/crawling-indexing/url-structure)
- [Slug 작성 모범 사례](https://moz.com/learn/seo/url)
