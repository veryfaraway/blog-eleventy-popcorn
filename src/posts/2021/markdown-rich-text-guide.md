---
layout: post.njk
title: "마크다운 Rich Text 작성 가이드"
description: "블로그 포스트 작성 시 활용할 수 있는 다양한 Rich Text 스타일 가이드"
keywords: rich-text, markdown
thumbnail: "/assets/og-image.png"
date: 2021-12-15
category: Tutorial
tags:
  - markdown
  - guide
  - writing
  - tutorial
draft: true
---

이 가이드는 블로그 포스트 작성 시 활용할 수 있는 다양한 스타일과 포맷을 소개합니다.

## 1. 컬러 강조 (Highlight)

중요한 텍스트를 컬러로 강조할 수 있습니다:

- <span class="highlight-blue">파란색 강조</span>는 정보성 내용에 사용
- <span class="highlight-green">초록색 강조</span>는 성공이나 긍정적인 내용에 사용
- <span class="highlight-orange">주황색 강조</span>는 주의가 필요한 내용에 사용
- <span class="highlight-red">빨간색 강조</span>는 경고나 중요한 내용에 사용

### 사용 예시

```html
<span class="highlight-blue">이 부분이 강조됩니다</span>
```

실제 적용: <span class="highlight-green">환경 변수 설정이 완료되었습니다!</span>

## 2. Alert 박스

다양한 타입의 알림 박스를 사용할 수 있습니다:

<div class="alert alert-info">
<strong>💡 정보</strong>
이것은 정보성 알림입니다. 유용한 팁이나 참고사항을 전달할 때 사용하세요.
</div>

<div class="alert alert-success">
<strong>✅ 성공</strong>
작업이 성공적으로 완료되었습니다. 긍정적인 결과를 표시할 때 사용하세요.
</div>

<div class="alert alert-warning">
<strong>⚠️ 주의</strong>
주의가 필요한 내용입니다. 사용자가 조심해야 할 사항을 알릴 때 사용하세요.
</div>

<div class="alert alert-danger">
<strong>🚨 경고</strong>
중요한 경고 메시지입니다. 심각한 문제나 반드시 알아야 할 내용에 사용하세요.
</div>

### Alert 사용법

```html
<div class="alert alert-info">
<strong>제목</strong>
내용을 여기에 작성합니다.
</div>
```

## 3. 인용구 (Blockquote)

> 이것은 인용구입니다. 다른 사람의 말을 인용하거나 중요한 문구를 강조할 때 사용합니다.
> 
> 여러 줄로 작성할 수도 있습니다.

```markdown
> 인용구 내용
```

## 4. 코드 블록

### 인라인 코드

문장 중간에 `const variable = "value"`처럼 코드를 삽입할 수 있습니다.

### 코드 블록 (언어 지정)

```javascript
// JavaScript 예제
function greet(name) {
  console.log(`Hello, ${name}!`);
}

greet("World");
```

```python
# Python 예제
def greet(name):
    print(f"Hello, {name}!")

greet("World")
```

```bash
# Bash 명령어
npm install
npm run build
```

## 5. 리스트

### 순서 없는 리스트

- 첫 번째 항목
- 두 번째 항목
  - 중첩된 항목 1
  - 중첩된 항목 2
- 세 번째 항목

### 순서 있는 리스트

1. 첫 번째 단계
2. 두 번째 단계
3. 세 번째 단계

### 체크리스트

- [ ] 완료되지 않은 작업
- [x] 완료된 작업
- [ ] 진행 중인 작업

## 6. 표 (Table)

| 항목 | 설명 | 상태 |
|------|------|------|
| 환경 변수 | GOOGLE_ANALYTICS_ID | ✅ 완료 |
| 배포 | Netlify 설정 | ✅ 완료 |
| SEO | 메타 태그 추가 | 🔄 진행중 |

## 7. 링크와 이미지

### 링크

**내부 링크** (현재 페이지에서 이동):
```markdown
[블로그 홈으로 이동](/)
```
[블로그 홈으로 이동](/)

**외부 링크** (자동으로 새 탭에서 열림):
```markdown
[외부 링크 - GitHub](https://github.com)
```
[외부 링크 - GitHub](https://github.com)

외부 링크는 자동으로 `target="_blank"`가 적용되어 새 탭에서 열립니다.

### 이미지

마크다운 이미지 문법:

```markdown
![대체 텍스트](/assets/logo.svg)
```

실제 렌더링:

![logo](/assets/logo.svg)

**이미지 경로 규칙:**
- 로컬 이미지: `/assets/이미지명.확장자`
- 외부 이미지: `https://example.com/image.jpg`
- 이미지는 `src/assets/` 폴더에 저장

## 8. 텍스트 스타일

- **굵은 글씨** 또는 __굵은 글씨__
- *기울임* 또는 _기울임_
- ~~취소선~~
- **_굵은 기울임_**

## 9. 구분선

---

위와 같이 구분선을 추가할 수 있습니다.

## 10. 실전 예제

<div class="alert alert-info">
<strong>💡 팁</strong>
환경 변수를 설정할 때는 <span class="highlight-blue">.env.example</span> 파일을 참고하세요.
</div>

다음 명령어로 프로젝트를 시작할 수 있습니다:

```bash
npm install
npm run dev
```

<div class="alert alert-warning">
<strong>⚠️ 주의</strong>
<span class="highlight-red">프로덕션 환경</span>에서는 반드시 환경 변수를 설정해야 합니다!
</div>

설정이 완료되면 <span class="highlight-green">빌드가 성공적으로 완료</span>됩니다.

## 마무리

이 가이드를 참고하여 더 풍부하고 읽기 쉬운 블로그 포스트를 작성해보세요! 🎉
