# SEO 최적화 가이드

## 검색 엔진 등록

### Google Search Console

#### 1단계: 사이트 등록
1. [Google Search Console](https://search.google.com/search-console) 접속
2. "속성 추가" 클릭
3. URL 접두어 방식 선택: `https://yourdomain.com`
4. 소유권 확인

#### 2단계: 소유권 확인 방법

**방법 1: HTML 파일 업로드 (권장)**
1. Google이 제공하는 HTML 파일 다운로드
2. `src/` 폴더에 파일 복사
3. `.eleventy.js`에 추가:
```javascript
eleventyConfig.addPassthroughCopy("src/google*.html");
```
4. 빌드 및 배포
5. Google에서 "확인" 클릭

**방법 2: HTML 태그**
1. Google이 제공하는 메타 태그 복사
2. `src/_layouts/base.njk`의 `<head>`에 추가:
```html
<meta name="google-site-verification" content="XXXXXXXXXX" />
```

#### 3단계: Sitemap 제출
1. Search Console에서 "Sitemaps" 메뉴
2. `https://yourdomain.com/sitemap.xml` 입력
3. "제출" 클릭
4. 색인 생성 대기 (보통 1-2주)

---

### Naver Search Advisor

#### 1단계: 사이트 등록
1. [네이버 서치어드바이저](https://searchadvisor.naver.com/) 접속
2. "웹마스터 도구" > "사이트 등록"
3. 사이트 URL 입력

#### 2단계: 소유권 확인
HTML 태그 방식:
```html
<meta name="naver-site-verification" content="XXXXXXXXXX" />
```

#### 3단계: Sitemap 제출
1. "요청" > "사이트맵 제출"
2. `https://yourdomain.com/sitemap.xml` 입력

---

### Bing Webmaster Tools

#### 1단계: 사이트 등록
1. [Bing Webmaster Tools](https://www.bing.com/webmasters) 접속
2. "사이트 추가" 클릭
3. Google Search Console에서 가져오기 (권장)

#### 2단계: Sitemap 제출
1. "Sitemaps" 메뉴
2. `https://yourdomain.com/sitemap.xml` 입력

---

## Sitemap 설정

### 자동 생성
블로그는 자동으로 sitemap을 생성합니다:
- 위치: `https://yourdomain.com/sitemap.xml`
- 모든 페이지 포함
- Draft 포스트 제외
- 우선순위 자동 설정

### 우선순위 (Priority)
- 홈페이지: 1.0
- 블로그/포스트: 0.8
- 카테고리/태그: 0.6
- 기타 페이지: 0.5

### 업데이트 빈도 (Change Frequency)
- 홈페이지: daily
- 블로그/포스트: weekly
- 카테고리/태그: weekly
- 기타 페이지: monthly

---

## Robots.txt

### 자동 생성
`https://yourdomain.com/robots.txt`에 자동 생성됩니다.

### 설정 내용
```
User-agent: *
Allow: /

Disallow: /drafts/

Sitemap: https://yourdomain.com/sitemap.xml
```

---

## 메타 태그 최적화

### 기본 메타 태그
포스트 Front Matter에 추가:
```yaml
---
title: 포스트 제목 (60자 이내)
description: 포스트 설명 (150-160자 이내)
keywords: 키워드1, 키워드2, 키워드3
thumbnail: https://example.com/image.jpg
---
```

### Open Graph (소셜 미디어)
자동으로 생성됩니다:
- `og:title`: 포스트 제목
- `og:description`: 포스트 설명
- `og:image`: Thumbnail 이미지
- `og:url`: 페이지 URL

---

## SEO 체크리스트

### 필수 항목
- [x] Sitemap 생성 및 제출
- [x] Robots.txt 설정
- [x] Google Search Console 등록
- [ ] 네이버 서치어드바이저 등록
- [x] 메타 태그 최적화
- [x] Open Graph 태그
- [x] 반응형 디자인
- [x] 빠른 로딩 속도

### 포스트 작성 시
- [ ] 제목 최적화 (60자 이내, 키워드 포함)
- [ ] 설명 작성 (150-160자, 키워드 포함)
- [ ] Thumbnail 이미지 추가
- [ ] 적절한 카테고리 선택
- [ ] 관련 태그 추가 (3-5개)
- [ ] 내부 링크 추가
- [ ] 이미지 alt 텍스트 작성
- [ ] 제목 계층 구조 (H1 > H2 > H3)

---

## 키워드 최적화

### 제목 작성 팁
```markdown
❌ 나쁜 예: "포스트 1"
✅ 좋은 예: "React Hooks 완벽 가이드 - useState, useEffect 사용법"

❌ 나쁜 예: "데이터베이스"
✅ 좋은 예: "MongoDB 기초부터 실전까지 - NoSQL 데이터베이스 입문"
```

### 설명 작성 팁
```markdown
❌ 나쁜 예: "React에 대한 글입니다."
✅ 좋은 예: "React Hooks의 기본 개념부터 실전 활용까지 알아봅니다. useState, useEffect, useContext 등 주요 Hooks의 사용법과 예제 코드를 제공합니다."
```

### 키워드 배치
1. **제목**: 주요 키워드 포함
2. **설명**: 주요 + 관련 키워드
3. **첫 문단**: 주요 키워드 자연스럽게 포함
4. **소제목**: 관련 키워드 포함
5. **본문**: 키워드 자연스럽게 분산 (키워드 밀도 1-2%)

---

## 구조화된 데이터 (Schema.org)

### 블로그 포스트 스키마 추가 (선택사항)

`src/_layouts/post.njk`에 추가:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "{{ title }}",
  "description": "{{ description }}",
  "image": "{{ thumbnail }}",
  "author": {
    "@type": "Person",
    "name": "{{ site.author.name }}"
  },
  "publisher": {
    "@type": "Organization",
    "name": "{{ site.title }}",
    "logo": {
      "@type": "ImageObject",
      "url": "{{ site.url }}/assets/logo.svg"
    }
  },
  "datePublished": "{{ date | dateFilter }}",
  "dateModified": "{{ date | dateFilter }}"
}
</script>
```

---

## 성과 측정

### Google Search Console 지표

#### 1. 노출수 (Impressions)
- 검색 결과에 표시된 횟수
- 목표: 꾸준한 증가

#### 2. 클릭수 (Clicks)
- 실제 클릭된 횟수
- 목표: 노출수 대비 증가

#### 3. CTR (Click Through Rate)
- 클릭률 = (클릭수 / 노출수) × 100
- 평균: 2-5%
- 목표: 5% 이상

#### 4. 평균 게재순위
- 검색 결과 평균 위치
- 목표: 10위 이내 (첫 페이지)

### 개선 방법

**CTR 낮음:**
- 제목 개선 (더 매력적으로)
- 설명 개선 (행동 유도)
- Thumbnail 추가

**게재순위 낮음:**
- 콘텐츠 품질 개선
- 키워드 최적화
- 내부 링크 추가
- 백링크 확보

---

## 콘텐츠 최적화

### 글 길이
- 최소: 1,000자
- 권장: 2,000-3,000자
- 심층 가이드: 5,000자 이상

### 이미지 최적화
```markdown
# 이미지 alt 텍스트 작성
![React Hooks 사용 예제](image.jpg)

# 이미지 크기 최적화
- 최대 너비: 1200px
- 용량: 200KB 이하 권장
- 포맷: WebP 또는 JPEG
```

### 내부 링크
```markdown
관련 글: [MongoDB 기초 가이드](/posts/mongodb-basics/)

더 알아보기: [React 시리즈](/categories/frontend/)
```

### 외부 링크
```markdown
# 권위 있는 사이트 링크
[MDN Web Docs](https://developer.mozilla.org/)

# nofollow 사용 (필요시)
<a href="https://example.com" rel="nofollow">링크</a>
```

---

## 페이지 속도 최적화

### 측정 도구
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)
- [WebPageTest](https://www.webpagetest.org/)

### 최적화 방법

#### 1. 이미지 최적화
- WebP 포맷 사용
- 적절한 크기로 리사이즈
- Lazy loading 적용 (이미 적용됨)

#### 2. CSS/JS 최적화
- Minify (이미 적용됨)
- 불필요한 코드 제거
- Critical CSS 인라인

#### 3. 캐싱
Netlify는 자동으로 캐싱을 처리합니다.

---

## 백링크 전략

### 자연스러운 백링크 확보

#### 1. 고품질 콘텐츠
- 독창적이고 유용한 정보
- 데이터와 통계 포함
- 인포그래픽 제작

#### 2. 게스트 포스팅
- 관련 블로그에 기고
- 자연스러운 링크 포함

#### 3. 소셜 미디어
- 트위터, 페이스북 공유
- 개발자 커뮤니티 참여
- Reddit, Hacker News 등

#### 4. 커뮤니티 참여
- Stack Overflow 답변
- GitHub 프로젝트 문서화
- 오픈소스 기여

---

## 모바일 최적화

### 체크리스트
- [x] 반응형 디자인
- [x] 터치 친화적 버튼 크기
- [x] 빠른 로딩 속도
- [x] 읽기 쉬운 폰트 크기
- [x] 가로 스크롤 없음

### 테스트
- [Google Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)

---

## 정기 점검 (월 1회)

### Google Search Console
- [ ] 색인 생성 상태 확인
- [ ] 크롤링 오류 확인
- [ ] 검색 성과 분석
- [ ] 상위 검색어 확인

### Google Analytics
- [ ] 트래픽 추이 확인
- [ ] 인기 페이지 확인
- [ ] 이탈률 분석
- [ ] 사용자 행동 분석

### 콘텐츠
- [ ] 오래된 포스트 업데이트
- [ ] 깨진 링크 수정
- [ ] 새로운 키워드 발굴
- [ ] 경쟁사 분석

---

## 참고 자료

- [Google 검색 센터](https://developers.google.com/search)
- [Google SEO 가이드](https://developers.google.com/search/docs/beginner/seo-starter-guide)
- [네이버 검색 등록 가이드](https://searchadvisor.naver.com/guide)
- [Moz SEO 가이드](https://moz.com/beginners-guide-to-seo)

---

**중요:** SEO는 장기적인 전략입니다. 꾸준히 고품질 콘텐츠를 발행하고, 사용자 경험을 개선하는 것이 가장 중요합니다! 🚀
