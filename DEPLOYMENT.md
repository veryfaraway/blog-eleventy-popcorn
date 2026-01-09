# 배포 가이드

## Netlify 배포

### 1단계: GitHub 저장소 준비

```bash
# Git 초기화 (아직 안했다면)
git init
git add .
git commit -m "Initial commit"

# GitHub 저장소 생성 후
git remote add origin https://github.com/username/repository.git
git push -u origin main
```

### 2단계: Netlify 사이트 생성

1. [Netlify](https://www.netlify.com/) 로그인
2. "Add new site" > "Import an existing project" 클릭
3. GitHub 연결 및 저장소 선택
4. 빌드 설정:
   - **Build command**: `npm run build`
   - **Publish directory**: `_site`
   - **Node version**: 18 (또는 최신 LTS)

### 3단계: 환경 변수 설정

Netlify 대시보드에서:
1. **Site settings** > **Environment variables** 이동
2. 다음 변수들을 추가:

#### Google Analytics
```
GOOGLE_ANALYTICS_ID = G-XXXXXXXXXX
```

#### Google AdSense
```
ADSENSE_ENABLED = true
ADSENSE_CLIENT_ID = ca-pub-XXXXXXXXXXXXXXXX
ADSENSE_SLOT_IN_ARTICLE = 1234567890
ADSENSE_SLOT_DISPLAY = 0987654321
```

#### Utterances (댓글)
```
UTTERANCES_ENABLED = true
UTTERANCES_REPO = username/repository
```

### 4단계: 배포

환경 변수 설정 후:
1. **Deploys** 탭으로 이동
2. "Trigger deploy" > "Deploy site" 클릭
3. 배포 완료 대기 (보통 1-2분)

---

## 로컬 개발 환경 설정

### 환경 변수 파일 생성

`.env` 파일 생성 (Git에 커밋되지 않음):

```bash
# .env 파일 생성
cp .env.example .env
```

`.env` 파일 수정:
```env
# Google Analytics
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# Google AdSense
ADSENSE_ENABLED=true
ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
ADSENSE_SLOT_IN_ARTICLE=1234567890
ADSENSE_SLOT_DISPLAY=0987654321

# Utterances
UTTERANCES_ENABLED=true
UTTERANCES_REPO=username/repository
```

### 환경 변수 로드

개발 서버 실행 시 자동으로 로드됩니다:

```bash
npm run dev
```

---

## 설정 우선순위

환경 변수와 `site.json` 모두 설정된 경우:

```
환경 변수 (최우선) > site.json (기본값)
```

### 예시

**환경 변수:**
```env
GOOGLE_ANALYTICS_ID=G-REAL-ID
```

**site.json:**
```json
{
  "googleAnalytics": "G-TEST-ID"
}
```

**결과:** `G-REAL-ID` 사용 (환경 변수 우선)

---

## 사용 시나리오

### 시나리오 1: 환경 변수만 사용 (권장)

**장점:**
- ✅ 민감한 정보를 Git에 커밋하지 않음
- ✅ 환경별로 다른 설정 가능
- ✅ 보안성 높음

**설정:**
1. `.env` 파일에 실제 값 입력
2. `site.json`에는 빈 문자열 또는 테스트 값

```json
{
  "googleAnalytics": "",
  "adsense": {
    "enabled": false,
    "client": "",
    "slots": {
      "inArticle": "",
      "display": ""
    }
  }
}
```

### 시나리오 2: site.json만 사용

**장점:**
- ✅ 설정이 간단함
- ✅ 환경 변수 설정 불필요

**단점:**
- ❌ ID가 Git에 노출됨 (공개 저장소에서는 비권장)

**설정:**
`site.json`에 직접 입력:
```json
{
  "googleAnalytics": "G-XXXXXXXXXX",
  "adsense": {
    "enabled": true,
    "client": "ca-pub-XXXXXXXXXXXXXXXX",
    "slots": {
      "inArticle": "1234567890",
      "display": "0987654321"
    }
  }
}
```

### 시나리오 3: 혼합 사용

**로컬 개발:**
- `site.json`에 테스트 값

**프로덕션:**
- Netlify 환경 변수에 실제 값

---

## 환경별 설정

### 개발 환경
```env
ADSENSE_ENABLED=false  # 로컬에서는 광고 비활성화
GOOGLE_ANALYTICS_ID=   # 로컬 트래픽 제외
```

### 스테이징 환경
```env
ADSENSE_ENABLED=false
GOOGLE_ANALYTICS_ID=G-STAGING-ID
```

### 프로덕션 환경
```env
ADSENSE_ENABLED=true
GOOGLE_ANALYTICS_ID=G-PRODUCTION-ID
ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
```

---

## 문제 해결

### 환경 변수가 적용되지 않음

**Netlify:**
1. 환경 변수 저장 확인
2. 사이트 재배포
3. 빌드 로그에서 환경 변수 확인

**로컬:**
1. `.env` 파일 위치 확인 (프로젝트 루트)
2. 개발 서버 재시작
3. `console.log(process.env.GOOGLE_ANALYTICS_ID)` 로 확인

### 광고가 표시되지 않음

1. `ADSENSE_ENABLED=true` 확인
2. AdSense 계정 승인 확인
3. 광고 코드 정확성 확인
4. 24-48시간 대기 (새 사이트)

### 빌드 실패

```bash
# 로컬에서 프로덕션 빌드 테스트
ELEVENTY_ENV=production npm run build
```

---

## 보안 권장사항

### DO ✅
- 환경 변수 사용
- `.env` 파일을 `.gitignore`에 추가
- `.env.example` 파일로 템플릿 제공
- 팀원과 안전한 방법으로 환경 변수 공유

### DON'T ❌
- `.env` 파일을 Git에 커밋
- 공개 저장소에 API 키 노출
- 환경 변수를 코드에 하드코딩
- 스크린샷에 환경 변수 포함

---

## Netlify CLI 사용 (선택사항)

### 설치
```bash
npm install -g netlify-cli
```

### 로그인
```bash
netlify login
```

### 로컬에서 Netlify 환경 변수 사용
```bash
netlify dev
```

### 환경 변수 설정
```bash
netlify env:set GOOGLE_ANALYTICS_ID "G-XXXXXXXXXX"
```

### 환경 변수 확인
```bash
netlify env:list
```

---

## 체크리스트

### 배포 전
- [ ] `.env.example` 파일 생성
- [ ] `.gitignore`에 `.env` 추가 확인
- [ ] 로컬에서 빌드 테스트
- [ ] 민감한 정보가 Git에 없는지 확인

### Netlify 설정
- [ ] GitHub 저장소 연결
- [ ] 빌드 설정 확인
- [ ] 환경 변수 추가
- [ ] 첫 배포 성공 확인

### 배포 후
- [ ] 사이트 접속 확인
- [ ] Google Analytics 작동 확인
- [ ] AdSense 광고 표시 확인
- [ ] 모바일 반응형 확인
- [ ] 페이지 로딩 속도 확인

---

## 참고 자료

- [Netlify 환경 변수 문서](https://docs.netlify.com/environment-variables/overview/)
- [Netlify 빌드 설정](https://docs.netlify.com/configure-builds/overview/)
- [Node.js 환경 변수](https://nodejs.org/en/learn/command-line/how-to-read-environment-variables-from-nodejs)
