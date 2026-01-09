# 카테고리 관리 가이드

블로그의 카테고리를 추가, 수정, 삭제하는 방법을 설명합니다.

## 📋 목차

1. [현재 카테고리 목록](#현재-카테고리-목록)
2. [카테고리 추가하기](#카테고리-추가하기)
3. [카테고리 수정하기](#카테고리-수정하기)
4. [카테고리 삭제하기](#카테고리-삭제하기)
5. [카테고리 사용하기](#카테고리-사용하기)

---

## 현재 카테고리 목록

기본 설정된 카테고리:
- **Frontend** - 프론트엔드 개발
- **Backend** - 백엔드 개발
- **Data** - 데이터베이스, 데이터 분석, 모델링
- **Tools** - 개발 도구, 유틸리티
- **DevOps** - 데브옵스/인프라
- **AI/ML** - 인공지능/머신러닝

---

## 카테고리 추가하기

### 1단계: `.eleventy.js` 파일 수정

파일 위치: `.eleventy.js`

#### A. 카테고리 컬렉션 추가

기존 카테고리 컬렉션 아래에 새 카테고리를 추가합니다:

```javascript
// 카테고리별 컬렉션
eleventyConfig.addCollection("Frontend", function(collection) {
  return collection.getAll().filter(item => item.data.category === "Frontend");
});

// 새 카테고리 추가 예시
eleventyConfig.addCollection("Mobile", function(collection) {
  return collection.getAll().filter(item => item.data.category === "Mobile");
});
```

#### B. 카테고리 목록에 추가

`categoryList` 배열에 새 카테고리를 추가합니다:

```javascript
// 카테고리 목록
eleventyConfig.addGlobalData("categoryList", [
  "Frontend",
  "Backend", 
  "Data",
  "Tools",
  "DevOps",
  "AI/ML",
  "Mobile"  // 새 카테고리 추가
]);
```

### 2단계: 빌드 및 확인

```bash
npm run build
npm run dev
```

브라우저에서 `/categories/` 페이지를 확인하면 새 카테고리가 표시됩니다.

---

## 카테고리 수정하기

### 카테고리 이름 변경

예: "DevOps" → "DevTools"로 변경

#### 1. `.eleventy.js` 수정

```javascript
// 컬렉션 이름 변경
eleventyConfig.addCollection("DevTools", function(collection) {
  return collection.getAll().filter(item => item.data.category === "DevTools");
});

// 목록에서 이름 변경
eleventyConfig.addGlobalData("categoryList", [
  "Frontend",
  "Backend", 
  "Modeling",
  "NoSQL",
  "DevTools",  // 변경됨
  "AI/ML"
]);
```

#### 2. 기존 포스트 업데이트

해당 카테고리를 사용하는 모든 포스트의 front matter를 수정합니다:

```yaml
---
title: "포스트 제목"
category: "DevTools"  # DevOps → DevTools로 변경
---
```

**일괄 변경 명령어:**

```bash
# macOS/Linux
find src/posts -name "*.md" -exec sed -i '' 's/category: "DevOps"/category: "DevTools"/g' {} +

# 또는 수동으로 검색 후 변경
grep -r 'category: "DevOps"' src/posts/
```

---

## 카테고리 삭제하기

### 1단계: `.eleventy.js`에서 제거

#### A. 컬렉션 제거

해당 카테고리의 `addCollection` 블록을 삭제합니다:

```javascript
// 이 부분을 삭제
eleventyConfig.addCollection("Modeling", function(collection) {
  return collection.getAll().filter(item => item.data.category === "Modeling");
});
```

#### B. 목록에서 제거

```javascript
eleventyConfig.addGlobalData("categoryList", [
  "Frontend",
  "Backend", 
  // "Data",  // 제거됨
  "Tools",
  "DevOps",
  "AI/ML"
]);
```

### 2단계: 기존 포스트 처리

해당 카테고리를 사용하는 포스트를 다른 카테고리로 변경하거나 삭제합니다:

```bash
# 해당 카테고리를 사용하는 포스트 찾기
grep -r 'category: "Modeling"' src/posts/
```

---

## 카테고리 사용하기

### 포스트에 카테고리 지정

포스트 파일의 front matter에 카테고리를 지정합니다:

```yaml
---
title: "React Hooks 완벽 가이드"
date: 2024-03-15
category: "Frontend"  # 카테고리 지정
tags: ["react", "hooks", "javascript"]
---
```

### 카테고리 페이지 URL

각 카테고리는 자동으로 다음 URL을 갖습니다:

- Frontend: `/categories/frontend/`
- Backend: `/categories/backend/`
- Mobile: `/categories/mobile/`

URL은 카테고리 이름의 소문자 버전입니다.

---

## 💡 팁과 주의사항

### 카테고리 네이밍 규칙

1. **대소문자 구분**: 정확히 일치해야 합니다
   - ✅ `category: "Frontend"`
   - ❌ `category: "frontend"` (작동하지 않음)

2. **특수문자 사용**: 슬래시(/)가 포함된 경우 주의
   - `"AI/ML"` - 가능하지만 URL은 `/categories/ai-ml/`로 변환됨

3. **일관성 유지**: 모든 곳에서 동일한 이름 사용
   - `.eleventy.js`의 컬렉션 이름
   - `categoryList` 배열
   - 포스트의 front matter

### 카테고리 vs 태그

- **카테고리**: 포스트당 1개, 큰 주제 분류
- **태그**: 포스트당 여러 개, 세부 주제 분류

```yaml
---
category: "Frontend"           # 하나만
tags: ["react", "hooks", "ui"] # 여러 개 가능
---
```

### 자동 카테고리 페이지 생성

카테고리를 추가하면 다음이 자동으로 생성됩니다:
- 카테고리 목록 페이지: `/categories/`
- 개별 카테고리 페이지: `/categories/카테고리명/`

---

## 🔧 고급: 동적 카테고리 시스템

현재는 카테고리를 수동으로 등록해야 하지만, 자동으로 감지하도록 변경할 수 있습니다.

### `.eleventy.js` 수정 (선택사항)

```javascript
// 모든 카테고리 자동 수집
eleventyConfig.addCollection("allCategories", function(collection) {
  let categories = new Set();
  collection.getAll().forEach(item => {
    if (item.data.category) {
      categories.add(item.data.category);
    }
  });
  return Array.from(categories).sort();
});

// 동적 카테고리 컬렉션 생성
const categories = ["Frontend", "Backend", "Data", "Tools", "DevOps", "AI/ML"];
categories.forEach(category => {
  eleventyConfig.addCollection(category, function(collection) {
    return collection.getAll().filter(item => item.data.category === category);
  });
});
```

이렇게 하면 카테고리 추가 시 한 곳만 수정하면 됩니다.

---

## 📝 체크리스트

카테고리를 추가/수정/삭제할 때 확인하세요:

- [ ] `.eleventy.js`에서 `addCollection` 추가/수정/삭제
- [ ] `.eleventy.js`에서 `categoryList` 배열 업데이트
- [ ] 기존 포스트의 카테고리 확인 및 수정
- [ ] `npm run build` 실행하여 에러 확인
- [ ] 브라우저에서 `/categories/` 페이지 확인
- [ ] 개별 카테고리 페이지 확인

---

## 🆘 문제 해결

### 카테고리 페이지가 비어있음

**원인**: 해당 카테고리를 사용하는 포스트가 없음

**해결**: 
1. 포스트에 카테고리가 정확히 지정되었는지 확인
2. 대소문자가 정확히 일치하는지 확인

### 카테고리가 목록에 표시되지 않음

**원인**: `categoryList`에 추가하지 않음

**해결**: `.eleventy.js`의 `categoryList` 배열에 추가

### 빌드 에러 발생

**원인**: 컬렉션 이름과 카테고리 이름 불일치

**해결**: 
```bash
# 에러 로그 확인
npm run build

# 문법 오류 확인
node .eleventy.js
```

---

## 📚 관련 문서

- [POST-CREATION-GUIDE.md](./POST-CREATION-GUIDE.md) - 포스트 작성 가이드
- [SLUG-GUIDE.md](./SLUG-GUIDE.md) - URL 슬러그 가이드
- [SEO.md](./SEO.md) - SEO 최적화 가이드
