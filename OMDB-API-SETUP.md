# OMDb API 설정 가이드

영화 정보와 로튼 토마토 점수를 표시하기 위해 OMDb API를 사용합니다.

## 1. OMDb API 키 신청 (무료)

### 신청 방법

1. [OMDb API 키 신청 페이지](https://www.omdbapi.com/apikey.aspx) 접속
2. **FREE** 플랜 선택 (하루 1,000회 요청)
3. 이메일 주소 입력
4. 이메일 확인 후 API 키 활성화 링크 클릭
5. API 키 복사 (예: `a1b2c3d4`)

### 무료 플랜 제한

- **하루 1,000회 요청**
- 정적 사이트는 빌드 시에만 API 호출하므로 충분함
- 캐싱 시스템으로 재빌드 시 API 호출 최소화 (7일 캐시)

## 2. 로컬 개발 환경 설정

### .env 파일 생성

프로젝트 루트에 `.env` 파일을 생성하고 API 키를 추가하세요:

```bash
# .env 파일 생성
cp .env.example .env
```

`.env` 파일에 다음 내용 추가:

```env
# OMDb API (영화 정보 및 로튼 토마토 점수)
OMDB_API_KEY=your-api-key-here
```

`your-api-key-here`를 실제 API 키로 교체하세요.

### 테스트

```bash
npm run build
```

빌드 로그에서 다음과 같은 메시지를 확인:

```
✅ 영화 정보 가져옴: Titanic
✅ 영화 정보 가져옴: Inception
```

## 3. Netlify 배포 설정

### 환경 변수 추가

1. Netlify 대시보드 접속
2. 사이트 선택
3. **Site settings** → **Environment variables** 메뉴
4. **Add a variable** 클릭
5. 다음 정보 입력:
   - **Key**: `OMDB_API_KEY`
   - **Values**: 실제 API 키 입력
   - **Scopes**: 
     - ✅ Same value for all deploy contexts (권장)
     - 또는 Production, Deploy Previews, Branch deploys 개별 설정
6. **Create variable** 클릭

### 재배포

환경 변수 추가 후 사이트를 재배포하세요:

1. **Deploys** 탭으로 이동
2. **Trigger deploy** → **Clear cache and deploy site** 클릭

## 4. 사용 방법

### 기본 사용

마크다운 파일에서 다음과 같이 사용:

```markdown
{% movie "타이타닉", "tt0120338" %}
```

### IMDb ID 찾기

1. [IMDb](https://www.imdb.com)에서 영화 검색
2. 영화 페이지 URL 확인
   - 예: `https://www.imdb.com/title/tt0120338/`
   - ID는 `tt0120338` 부분

### 커스텀 포스터 사용

```markdown
{% movie "타이타닉", "tt0120338", "https://example.com/poster.jpg" %}
```

## 5. 캐싱 시스템

### 작동 방식

- API 응답은 `.cache/movie-{imdbId}.json` 파일에 저장
- 캐시 유효 기간: 7일
- 캐시가 있으면 API 호출 안 함 (빠른 빌드)

### 캐시 초기화

캐시를 삭제하고 최신 정보를 가져오려면:

```bash
rm -rf .cache/movie-*.json
npm run build
```

## 6. 표시되는 정보

영화 카드에 표시되는 정보:

- 🎬 **영화 제목** (Title)
- 📅 **개봉 연도** (Year)
- 🖼️ **포스터 이미지** (Poster)
- ⭐ **IMDb 평점** (IMDb Rating)
- 🍅 **로튼 토마토 점수** (Rotten Tomatoes Score)

## 7. 문제 해결

### API 키가 작동하지 않음

```bash
# 환경 변수 확인
echo $OMDB_API_KEY

# 빌드 로그 확인
npm run build
```

빌드 로그에서 다음 메시지 확인:
- `✅ Set`: API 키가 설정됨
- `❌ Not set`: API 키가 없음

### API 호출 실패

빌드 로그에서 오류 메시지 확인:

```
⚠️  OMDb API 오류: Invalid API key!
❌ OMDb API 호출 실패: fetch failed
```

해결 방법:
1. API 키가 올바른지 확인
2. 이메일에서 API 키 활성화 링크 클릭했는지 확인
3. 하루 1,000회 제한을 초과하지 않았는지 확인

### 캐시 문제

캐시가 오래되어 최신 정보가 표시되지 않으면:

```bash
# 특정 영화 캐시 삭제
rm .cache/movie-tt0120338.json

# 모든 영화 캐시 삭제
rm -rf .cache/movie-*.json
```

## 8. API 키 없이 사용

API 키가 없어도 기본 정보는 표시됩니다:

- 영화 제목
- IMDb 링크
- 포스터 (제공된 경우)
- 💡 안내 메시지: "OMDb API 키를 설정하면 평점이 표시됩니다"

## 참고 링크

- [OMDb API 공식 사이트](https://www.omdbapi.com/)
- [OMDb API 문서](https://www.omdbapi.com/#parameters)
- [IMDb](https://www.imdb.com/)
- [Rotten Tomatoes](https://www.rottentomatoes.com/)

