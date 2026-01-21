# Disqus 댓글 시스템 설정 가이드

이 블로그는 Disqus 댓글 시스템을 사용합니다. 아래 단계를 따라 설정하세요.

## 1. Disqus 계정 생성 및 사이트 등록

1. [Disqus](https://disqus.com/) 접속
2. "Get Started" 클릭
3. "I want to install Disqus on my site" 선택
4. 사이트 정보 입력:
   - **Website Name**: 블로그 이름 (예: popcorn-report)
   - **Category**: 적절한 카테고리 선택 (예: Entertainment, Travel)
5. 플랜 선택: **Basic (무료)** 선택
6. 플랫폼 선택 화면에서 아무거나 선택 (우리는 직접 코드를 삽입했으므로)

## 2. Disqus Shortname 확인

1. Disqus 대시보드에서 **Settings** > **General** 이동
2. **Shortname** 확인 (예: `popcorn-report`)
   - 이것이 `DISQUS_SHORTNAME`에 들어갈 값입니다

## 3. Netlify 환경변수 설정

### Netlify 대시보드에서 설정:

1. Netlify 사이트 대시보드 접속
2. **Site settings** > **Environment variables** 이동
3. 다음 환경변수 추가:

```
DISQUS_ENABLED=true
DISQUS_SHORTNAME=your-disqus-shortname
```

**중요**: `your-disqus-shortname`을 실제 Disqus shortname으로 교체하세요!

### 로컬 개발 환경 설정:

프로젝트 루트에 `.env` 파일 생성 (`.env.example` 참고):

```bash
# Disqus (댓글)
DISQUS_ENABLED=true
DISQUS_SHORTNAME=your-disqus-shortname
```

## 4. 배포 및 확인

1. 환경변수 설정 후 Netlify에서 재배포
2. 블로그 포스트 하단에 Disqus 댓글창이 나타나는지 확인

## 5. Disqus 설정 최적화 (선택사항)

Disqus 대시보드에서 추가 설정:

### 5.1 Trusted Domains 설정
- **Settings** > **Advanced** > **Trusted Domains**
- 블로그 도메인 추가 (예: `popcorn.eone.one`)

### 5.2 댓글 정책 설정
- **Settings** > **Community**
- Guest Commenting: 활성화 (게스트 댓글 허용)
- Comment Voting: 활성화 (댓글 추천 기능)
- Media Embeds: 활성화 (이미지/동영상 삽입)
- **Comment Policy URL**: `https://popcorn.eone.one/comment-policy/`
- **Comment Policy Summary**: `서로 존중하는 건강한 커뮤니티를 위해 욕설, 비방, 스팸은 금지됩니다. 스포일러 작성 시 경고를 표시해주세요.`

### 5.3 모더레이션 설정
- **Moderation** > **Settings**
- Pre-moderation: 필요시 활성화 (댓글 승인 후 표시)
- Spam filter: 활성화 (자동 스팸 필터링)

### 5.4 알림 설정
- **Settings** > **Email**
- 새 댓글 알림 설정

## 6. 광고 제거 (유료)

무료 플랜은 하단에 작은 광고가 표시됩니다. 광고를 제거하려면:
- Disqus Plus ($10/월) 또는 Pro ($89/월) 플랜으로 업그레이드

## 문제 해결

### 댓글창이 나타나지 않는 경우:
1. 환경변수가 올바르게 설정되었는지 확인
2. Netlify에서 재배포 했는지 확인
3. 브라우저 콘솔에서 에러 메시지 확인
4. Disqus shortname이 정확한지 확인

### 댓글이 로드되지 않는 경우:
1. Disqus Trusted Domains에 도메인이 추가되었는지 확인
2. 브라우저 광고 차단기 비활성화 후 테스트
3. 시크릿 모드에서 테스트

## 참고 링크

- [Disqus 공식 문서](https://help.disqus.com/)
- [Disqus 대시보드](https://disqus.com/admin/)
