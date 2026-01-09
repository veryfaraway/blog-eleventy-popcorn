---
layout: post.njk
title: 2024년 포스트 예제
description: 연도별 디렉토리로 포스트를 관리할 수 있습니다.
date: 2021-12-15
category: Tutorial
tags:
  - organization
  - tips
draft: true
thumbnail: https://images.unsplash.com/photo-1506784365847-bbad939e9335?q=80&w=2368&auto=format&fit=crop
---

# 포스트 디렉토리 구조

포스트가 많아지면 관리가 어려워집니다. 연도별로 디렉토리를 만들어 정리하세요!

## 디렉토리 구조 예시

```
src/posts/
├── 2024/
│   ├── post-1.md
│   ├── post-2.md
│   └── post-3.md
├── 2025/
│   ├── post-4.md
│   └── post-5.md
└── drafts/
    └── draft-post.md
```

## 장점

1. **쉬운 관리** - 연도별로 포스트를 찾기 쉽습니다
2. **자동 인식** - Eleventy가 자동으로 모든 하위 디렉토리를 스캔합니다
3. **유연성** - 카테고리별, 주제별 등 원하는 대로 구조화 가능

## 설정

`.eleventy.js` 파일에서 다음과 같이 설정되어 있습니다:

```javascript
eleventyConfig.addCollection("blog", function(collection) {
  return collection.getFilteredByGlob("src/posts/**/*.md")
    .sort(function(a, b) {
      return b.date - a.date;
    });
});
```

`**/*.md` 패턴이 모든 하위 디렉토리의 마크다운 파일을 찾아줍니다!
