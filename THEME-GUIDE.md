# 테마 적용 가이드

## 개요
- 대상: 상단 메뉴 영역에 계절성/이벤트 테마를 입힘
- 적용 방식: 환경변수 `THEME_NAME` 값을 통해 빌드 시 선택
- 기본값: 환경변수가 없거나 `none`이면 **테마 미적용** (평상시 사용)

## 사용 방법
1. 환경변수 설정
   - 로컬: `.env` 파일에 `THEME_NAME=christmas` 등으로 설정
   - Netlify: Site settings → Build & deploy → Environment → `THEME_NAME` 추가
   - 허용 값(소문자): `christmas`, `spring`, `summer`, `autumn`
   - 비활성화: `THEME_NAME=none` 또는 unset

2. 빌드/프리뷰
   - `npm run start` (로컬) 또는 Netlify Preview/Production 빌드 시 적용
   - 환경변수가 변경되면 새 빌드에서 반영

## 테마 파일 구성
- 데이터: `src/_data/theme.js`
  - `THEME_NAME`이 없거나 `none`이면 `theme.current`가 `null` → 레이아웃에서 테마 클래스 미적용
  - 값이 유효하면 `theme.current`에 선택된 테마 정보 주입
- 스타일: `src/css/theme.css`
  - `theme--{name}` 클래스 기반 CSS 변수로 색/배경 정의
- 템플릿 적용
  - `src/_layouts/base.njk` : `<body>`에 `theme--{name}` 클래스 조건부 추가
  - `src/_includes/header.njk` : 메뉴 영역에 `theme-header`, `theme-nav-link` 클래스 사용

## 테마 추가/커스터마이징
1) `src/_data/theme.js`에 테마 정의 추가
   - `name`, `displayName`, `accent`, `accentLight`, `text`, `background`, `deco` 필드 참고
2) `src/css/theme.css`에 `.theme--{name}` 블록 추가
   - `--theme-bg`에 그라디언트 또는 `url("/assets/theme/xxx.svg")` 가능
3) 자산 추가 시 `src/assets/theme/` 등에 저장하면 Eleventy passthrough로 제공

## 주의 사항
- 환경변수 우선: 값이 없거나 `none`이면 테마가 완전히 꺼짐
- 대소문자: 내부에서 소문자로 처리하므로 값은 소문자 사용 권장
- 캐싱: 배포 환경에서 CSS가 캐시될 수 있으니 변경 후 새 빌드/배포 필요

