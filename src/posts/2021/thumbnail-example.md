---
layout: post.njk
title: Thumbnail 이미지 예제
description: 포스트에 썸네일 이미지를 추가하는 방법을 알아봅니다.
date: 2021-01-27
category: Tutorial
tags:
  - tutorial
  - images
readingTime: 3
thumbnail: https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=450&fit=crop
draft: true
---

# Thumbnail 이미지 사용하기

이 포스트는 상단에 멋진 썸네일 이미지가 표시됩니다!

## 사용 방법

### 1. 외부 이미지 URL 사용

Front Matter에 `thumbnail` 필드를 추가하세요:

```yaml
---
layout: post.njk
title: 포스트 제목
thumbnail: https://example.com/image.jpg
---
```

### 2. 로컬 이미지 사용

`src/assets/images/` 폴더에 이미지를 저장하고:

```yaml
---
layout: post.njk
title: 포스트 제목
thumbnail: /assets/images/my-image.jpg
---
```

## 추천 이미지 크기

- **비율**: 16:9 (예: 1600x900px)
- **최소 크기**: 800x450px
- **최대 용량**: 500KB 이하 권장

## 무료 이미지 사이트

- [Unsplash](https://unsplash.com/) - 고품질 무료 이미지
- [Pexels](https://www.pexels.com/) - 다양한 무료 사진
- [Pixabay](https://pixabay.com/) - 무료 이미지와 일러스트

## 이미지가 없으면?

Thumbnail을 지정하지 않으면 기본 아이콘이 표시됩니다. 걱정하지 마세요!
