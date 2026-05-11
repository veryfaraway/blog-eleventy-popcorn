# 블로그 공통 Makefile
.PHONY: init build run test-sync

# 환경 초기화 (심볼릭 링크 강제 생성 등)
init:
	npm install
	# 개발 환경을 위해 로컬 테마와 node_modules를 링크
	rm -rf node_modules/@veryfaraway/eleventy-theme
	mkdir -p node_modules/@veryfaraway
	ln -s ../../../blog-eleventy-theme node_modules/@veryfaraway/eleventy-theme

# 빌드
build:
	npm run build

# 개발 서버 실행
run:
	npm run dev

# 테마 동기화 상태 검사
test-sync:
	npm run check:theme-sync
