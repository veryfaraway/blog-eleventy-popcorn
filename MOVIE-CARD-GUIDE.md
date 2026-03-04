# 영화 카드 사용 가이드

블로그 포스트에서 영화 정보를 로튼 토마토 점수와 함께 표시할 수 있습니다.

## 기본 사용법

```markdown
{% movie "영화 제목", "IMDb ID" %}
```

## 파라미터 설명

1. **영화 제목** (필수): 영화 이름 (API 실패 시 표시용)
2. **IMDb ID** (필수): IMDb ID (예: "tt0120338")
3. **포스터 URL** (선택): 커스텀 포스터 이미지 URL

## 사용 예시

### 1. 기본 사용 (IMDb ID만)

```markdown
{% movie "타이타닉", "tt0120338" %}
```

### 2. 커스텀 포스터 사용

```markdown
{% movie "인셉션", "tt1375666", "https://example.com/inception-poster.jpg" %}
```

## IMDb ID 찾는 방법

1. [IMDb 웹사이트](https://www.imdb.com)에서 영화 검색
2. 영화 페이지 URL 확인
   - 예: `https://www.imdb.com/title/tt0120338/`
   - ID는 `tt0120338` 부분

## 표시되는 정보

영화 카드에 자동으로 표시되는 정보:

- 🎬 **영화 제목** (Title)
- 📅 **개봉 연도** (Year)
- 🖼️ **포스터 이미지** (Poster)
- ⭐ **IMDb 평점** (IMDb Rating) - 예: 8.4/10
- 🍅 **로튼 토마토 점수** (Rotten Tomatoes Score) - 예: 93%

## 디자인 특징

- 모던하고 컴팩트한 카드 디자인
- 포스터 이미지 (96x144px)
- 호버 효과 (그림자 강조)
- 반응형 디자인 (모바일 최적화)
- IMDb 링크 (새 탭에서 열림)
- 이미지 로드 실패 시 플레이스홀더 자동 표시

## API 설정

영화 평점을 표시하려면 OMDb API 키가 필요합니다.

### 무료 API 키 신청

1. [OMDb API 키 신청](https://www.omdbapi.com/apikey.aspx)
2. **FREE** 플랜 선택 (하루 1,000회 요청)
3. 이메일로 받은 API 키 활성화

### 로컬 설정

`.env` 파일에 API 키 추가:

```env
OMDB_API_KEY=your-api-key-here
```

### Netlify 설정

1. Netlify 대시보드 → Site settings → Environment variables
2. 변수 추가:
   - Key: `OMDB_API_KEY`
   - Value: 실제 API 키

자세한 내용은 [OMDB-API-SETUP.md](./OMDB-API-SETUP.md)를 참고하세요.

## 캐싱 시스템

### 작동 방식

- API 응답은 `.cache/movie-{imdbId}.json`에 저장
- 캐시 유효 기간: 7일
- 빌드 시에만 API 호출 (방문자는 API 사용 안 함)
- 재빌드 시 캐시 사용으로 API 호출 최소화

### 장점

- **빠른 빌드**: 캐시된 데이터 재사용
- **API 제한 절약**: 중복 호출 방지
- **안정성**: API 장애 시에도 캐시 사용

### 캐시 초기화

최신 정보를 가져오려면:

```bash
rm -rf .cache/movie-*.json
npm run build
```

## API 키 없이 사용

API 키가 없어도 기본 정보는 표시됩니다:

- 영화 제목
- IMDb 링크
- 포스터 (제공된 경우)
- 💡 안내 메시지: "OMDb API 키를 설정하면 평점이 표시됩니다"

## 실제 사용 예시

```markdown
---
title: "2024년 최고의 영화 추천"
---

올해 가장 인상 깊었던 영화를 소개합니다.

{% movie "오펜하이머", "tt15398776" %}

크리스토퍼 놀란 감독의 역작으로, 원자폭탄의 아버지 오펜하이머의 이야기를 다룹니다.

{% movie "바비", "tt1517268" %}

그레타 거윅 감독의 바비 인형 실사화 영화로, 예상을 뒤엎는 깊이 있는 메시지를 담고 있습니다.
```

## 문제 해결

### 영화 정보가 표시되지 않음

1. **IMDb ID 확인**: `tt`로 시작하는 올바른 ID인지 확인
2. **API 키 확인**: 환경 변수가 올바르게 설정되었는지 확인
3. **빌드 로그 확인**: 오류 메시지 확인

```bash
npm run build
```

### 빌드 로그 메시지

성공:
```
✅ 영화 정보 가져옴: Titanic
```

실패:
```
⚠️  OMDb API 오류: Invalid API key!
❌ OMDb API 호출 실패: fetch failed
```

### 포스터 이미지가 깨짐

- OMDb API가 제공하는 포스터 URL이 유효하지 않을 수 있음
- 세 번째 파라미터로 커스텀 포스터 URL 제공:

```markdown
{% movie "영화 제목", "tt1234567", "https://your-poster-url.jpg" %}
```

## 팁

1. **일관성**: 같은 영화는 동일한 IMDb ID 사용
2. **캐싱**: 자주 변경되지 않는 정보이므로 7일 캐시 활용
3. **API 제한**: 무료 플랜은 하루 1,000회이지만 캐싱으로 충분
4. **포스터 품질**: 가능하면 고해상도 포스터 URL 제공
5. **빌드 최적화**: 캐시 파일은 Git에 커밋하지 않음 (.gitignore에 포함)

## 스타일 커스터마이징

`src/css/style.css` 또는 `src/css/input.css`에서 `.movie-card` 클래스를 수정하여 디자인을 변경할 수 있습니다.

```css
.movie-card {
  /* 커스텀 스타일 추가 */
}
```

## 참고 링크

- [OMDb API 공식 사이트](https://www.omdbapi.com/)
- [IMDb](https://www.imdb.com/)
- [Rotten Tomatoes](https://www.rottentomatoes.com/)
- [OMDB-API-SETUP.md](./OMDB-API-SETUP.md) - 상세 설정 가이드

