# 다국어 지원 가이드

이 블로그는 한국어와 영어를 지원합니다. 간단하게 구현되어 있으며, 포스트 작성 시 언어만 지정하면 됩니다.

## 빠른 시작

### 1. 한국어 포스트 작성

```yaml
---
layout: post.njk
title: "Java 21의 새로운 기능"
lang: ko  # 또는 생략 (기본값)
date: 2025-01-30
category: Backend
tags:
  - java
  - java21
---
```

### 2. 영어 포스트 작성

```yaml
---
layout: post.njk
title: "New Features in Java 21"
lang: en
date: 2025-01-30
category: Backend
tags:
  - java
  - java21
---
```

## 주요 기능

### 언어 전환 버튼

헤더 오른쪽에 언어 전환 버튼이 있습니다:
- **한국어**: 한국어 포스트 필터링
- **English**: 영어 포스트 필터링

사용자가 언어를 선택하면:
1. URL에 `?lang=ko` 또는 `?lang=en` 파라미터가 추가됩니다
2. 선택한 언어가 localStorage에 저장됩니다
3. 다음 방문 시에도 선택한 언어가 유지됩니다

### 언어별 컬렉션

Eleventy에서 다음 컬렉션을 사용할 수 있습니다:

```nunjucks
{# 한국어 포스트만 #}
{% for post in collections.blog_ko %}

{# 영어 포스트만 #}
{% for post in collections.blog_en %}

{# 모든 언어 포스트 #}
{% for post in collections.blog %}
```

### 언어별 필터링

템플릿에서 언어별로 포스트를 필터링할 수 있습니다:

```nunjucks
{% set currentLang = page.lang or "ko" %}
{% set langPosts = collections.blog | filterByLang(currentLang) %}
{% for post in langPosts %}
  ...
{% endfor %}
```

## 다국어 텍스트

### 번역 데이터

모든 UI 텍스트는 `src/_data/i18n.js`에 정의되어 있습니다:

```javascript
{
  ko: {
    nav: { home: "홈", blog: "블로그", ... },
    home: { title: "주경야근", ... },
    ...
  },
  en: {
    nav: { home: "Home", blog: "Blog", ... },
    home: { title: "Burn the Midnight Oil", ... },
    ...
  }
}
```

### 템플릿에서 사용

```nunjucks
{% set currentLang = page.lang or "ko" %}
{{ i18n[currentLang].nav.home }}
{{ i18n[currentLang].home.title }}
```

## 동일 주제의 다국어 포스트

같은 주제를 한국어와 영어로 모두 작성하려면:

1. **한국어 포스트**: `my-post-ko.md`
```yaml
---
title: "Java 21 완벽 가이드"
lang: ko
slug: java-21-guide-ko
relatedPosts:
  - java-21-guide-en
---
```

2. **영어 포스트**: `my-post-en.md`
```yaml
---
title: "Complete Guide to Java 21"
lang: en
slug: java-21-guide-en
relatedPosts:
  - java-21-guide-ko
---
```

## SEO 최적화

### 언어별 메타 태그

각 포스트의 front matter에서 언어를 지정하면 HTML의 `lang` 속성이 자동으로 설정됩니다:

```html
<html lang="ko">  <!-- 또는 lang="en" -->
```

### 검색 엔진 최적화

- 언어별 포스트를 작성하면 **검색 유입량 증가**
- 한국어 키워드와 영어 키워드를 모두 타겟팅 가능
- Google은 언어별로 콘텐츠를 인덱싱

## 번역 추가하기

새로운 번역을 추가하려면 `src/_data/i18n.js`를 수정하세요:

```javascript
module.exports = {
  ko: {
    // 한국어 번역
  },
  en: {
    // 영어 번역
  },
  // 새로운 언어 추가
  ja: {
    nav: { home: "ホーム", ... },
    ...
  }
};
```

그리고 템플릿과 설정 파일을 업데이트하세요.

## 팁

### 1. 블로그 유입량 증가

- **한국어 포스트**: 한국 개발자 커뮤니티 타겟팅
- **영어 포스트**: 글로벌 개발자 커뮤니티 타겟팅
- 동일 주제를 양쪽 언어로 작성하면 검색 엔진 유입량이 크게 증가합니다

### 2. 언어 선택 전략

- **기술 튜토리얼**: 영어로 작성 (더 넓은 타겟)
- **한국 개발 환경 가이드**: 한국어로 작성
- **트렌드 분석**: 양쪽 언어로 작성

### 3. 콘텐츠 관리

- 언어별로 폴더를 나눌 필요 없습니다
- `lang` 필드로 자동 필터링됩니다
- 같은 slug를 사용하지 마세요 (충돌 방지)

## 문제 해결

### 언어 전환이 안 돼요

1. 브라우저 콘솔에서 오류 확인
2. localStorage 확인: `localStorage.getItem('preferredLanguage')`
3. JavaScript가 활성화되어 있는지 확인

### 포스트가 언어별로 필터링이 안 돼요

1. 포스트 front matter에 `lang` 필드가 있는지 확인
2. `collections.blog_ko` 또는 `collections.blog_en` 사용
3. 빌드 후 확인: `npm run build`

### 번역 텍스트가 안 나와요

1. `src/_data/i18n.js`에 해당 키가 있는지 확인
2. 템플릿에서 `i18n[currentLang]` 경로가 올바른지 확인
3. 기본값 설정 확인: `i18n[currentLang].key | default(i18n.ko.key)`

## 참고

- [POST-CREATION-GUIDE.md](./POST-CREATION-GUIDE.md) - 포스트 작성 가이드
- [README.md](./README.md) - 프로젝트 개요
