---
layout: post.njk
title: 작성 중인 포스트 예제
description: 이 포스트는 아직 작성 중입니다. 로컬에서만 보입니다.
date: 2021-01-28
category: Tutorial
tags:
  - draft
  - example
readingTime: 2
draft: true
thumbnail: https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=450&fit=crop
---

# 작성 중인 포스트

이 포스트는 **draft: true** 설정으로 인해:
- ✅ 로컬 개발 환경(`npm run dev`)에서는 보입니다
- ❌ 프로덕션 빌드(`npm run build`)에서는 제외됩니다

## Draft 기능 사용법

Front Matter에 `draft: true`를 추가하면 됩니다:

```yaml
---
layout: post.njk
title: 포스트 제목
draft: true
---
```

## 완성되면

`draft: true`를 제거하거나 `draft: false`로 변경하면 프로덕션에 포함됩니다.
