const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const Image = require("@11ty/eleventy-img");
const fs = require("fs");
const path = require("path");

module.exports = function (eleventyConfig) {
  // Permalink 중복 체크를 위한 Map
  const permalinkMap = new Map();
  const duplicates = [];
  // 플러그인 - Prism.js 테마 설정
  eleventyConfig.addPlugin(syntaxHighlight, {
    preAttributes: {
      class: ({ language }) => `language-${language}`
    }
  });

  // 정적 자산 복사
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/assets");

  // SEO 및 인증 파일
  eleventyConfig.addPassthroughCopy("src/ads.txt");
  eleventyConfig.addPassthroughCopy("src/*.html");

  // Prism.js 테마 복사
  eleventyConfig.addPassthroughCopy({
    "node_modules/prismjs/themes/prism-tomorrow.css": "css/prism-theme.css"
  });

  // 이미지 처리 필터
  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);
  // Cloudinary 전용 shortcode (반응형 srcset + LQIP)
  eleventyConfig.addShortcode("cloudinary", cloudinaryShortcode);

  // Permalink 생성 필터
  eleventyConfig.addFilter("generatePermalink", function (page) {
    // posts가 아닌 경우 기본 동작
    if (!page.inputPath.includes('/posts/')) {
      return page.url;
    }

    const data = this.ctx;

    // slug가 있으면 사용, 없으면 파일명에서 숫자 prefix 제거
    let slug = data.slug;
    if (!slug) {
      // fileSlug에서 숫자 prefix 제거 (예: 011-title -> title)
      slug = page.fileSlug.replace(/^\d+-/, '');
    }

    // 날짜에서 연도 추출
    const date = data.date || new Date();
    const year = date.getFullYear();

    // lang 파라미터 추가 (다국어 지원)
    const lang = data.lang || 'ko';
    const langParam = lang !== 'ko' ? `?lang=${lang}` : '';

    return `/posts/${year}/${slug}/${langParam}`;
  });

  // 날짜 필터
  eleventyConfig.addFilter("dateFilter", function (date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });

  // ISO 날짜/시간 필터 (구조화 데이터 등에서 사용)
  eleventyConfig.addFilter("isoDateTime", function (date) {
    if (!date) return "";
    const d = (date instanceof Date) ? date : new Date(date);
    if (Number.isNaN(d.getTime())) return "";
    return d.toISOString();
  });

  // limit 필터
  eleventyConfig.addFilter("limit", function (array, limit) {
    return array.slice(0, limit);
  });

  // slice 필터
  eleventyConfig.addFilter("slice", function (array, start, end) {
    return array.slice(start, end);
  });

  // getAllTags 필터
  eleventyConfig.addFilter("getAllTags", function (collection) {
    let tagSet = new Set();
    collection.forEach(item => {
      (item.data.tags || []).forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).filter(tag => tag !== "blog" && tag !== "post").sort();
  });

  // filterByTag 필터
  eleventyConfig.addFilter("filterByTag", function (collection, tag) {
    return collection.filter(item => {
      return (item.data.tags || []).includes(tag);
    });
  });

  // find 필터 - slug로 포스트 찾기
  eleventyConfig.addFilter("find", function (collection, slug) {
    return collection.find(item => item.data.slug === slug);
  });

  // AdSense 광고 shortcode
  eleventyConfig.addShortcode("adsense", function (type = "display") {
    const siteData = this.ctx.site || {};
    const envData = this.ctx.env || {};

    // 환경 변수 우선, 없으면 site.json 사용
    const adsenseEnabled = envData.adsense?.enabled ?? siteData.adsense?.enabled;
    const adsenseClient = envData.adsense?.client || siteData.adsense?.client;
    const adsenseSlots = {
      inArticle: envData.adsense?.slots?.inArticle || siteData.adsense?.slots?.inArticle,
      display: envData.adsense?.slots?.display || siteData.adsense?.slots?.display
    };

    if (!adsenseEnabled || !adsenseClient) {
      return '<!-- AdSense disabled -->';
    }

    const slot = type === "inArticle" ? adsenseSlots.inArticle : adsenseSlots.display;

    if (type === "inArticle") {
      return `
        <div class="my-8 flex justify-center">
          <ins class="adsbygoogle"
               style="display:block; text-align:center;"
               data-ad-layout="in-article"
               data-ad-format="fluid"
               data-ad-client="${adsenseClient}"
               data-ad-slot="${slot}"></ins>
        </div>
        <script>
          (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
      `;
    } else {
      return `
        <div class="my-8 flex justify-center">
          <ins class="adsbygoogle"
               style="display:block"
               data-ad-client="${adsenseClient}"
               data-ad-slot="${slot}"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
        </div>
        <script>
          (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
      `;
    }
  });

  // 인물 카드 shortcode
  eleventyConfig.addShortcode("person", function (name, role = "", image = "", link = "", imdb = "") {
    const imageUrl = image || `https://via.placeholder.com/60x60?text=${encodeURIComponent(name)}`;
    const profileLink = link || (imdb ? `https://www.imdb.com/name/${imdb}/` : "#");
    const hasLink = link || imdb;

    // NOTE: 마크다운에서 블록 HTML로 인식되도록 "<div"가 라인 시작에 오게(앞 공백/개행 없이) 반환해야
    // <p>로 감싸지지 않고, Typography(.prose)의 문단 마진이 붙지 않습니다.
    return `<div class="person-card not-prose my-3 p-2.5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all">
  <div class="flex items-center gap-2.5">
    <div class="flex-shrink-0">
      ${hasLink ? `<a href="${profileLink}" target="_blank" rel="noopener noreferrer">` : ''}
        <img src="${imageUrl}" 
             alt="${name}" 
             class="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
             onerror="this.src='https://via.placeholder.com/60x60?text=${encodeURIComponent(name)}'">
      ${hasLink ? '</a>' : ''}
    </div>
    <div class="flex-1 min-w-0">
      <h3 class="text-base font-bold text-gray-900 leading-tight">
        ${hasLink ? `<a href="${profileLink}" target="_blank" rel="noopener noreferrer" class="hover:text-primary-600 transition-colors">${name}</a>` : name}
      </h3>
      ${role ? `<p class="text-sm text-gray-600 mt-0.5">${role}</p>` : ''}
    </div>
  </div>
</div>`;
  });

  // 인물 미니 링크 shortcode (텍스트 크기 수준의 작은 아바타 링크)
  eleventyConfig.addShortcode("personInline", function (name, image = "", link = "", imdb = "") {
    const imageUrl = image || `https://via.placeholder.com/48x48?text=${encodeURIComponent(name)}`;
    const profileLink = link || (imdb ? `https://www.imdb.com/name/${imdb}/` : "#");
    const hasLink = link || imdb;

    const content = `<span class="inline-flex items-center gap-2 text-base font-medium text-primary-700 hover:text-primary-800 underline-offset-4 align-middle">
  <img src="${imageUrl}"
       alt="${name}"
       class="w-8 h-8 rounded-full object-cover border border-gray-200"
       onerror="this.src='https://via.placeholder.com/48x48?text=${encodeURIComponent(name)}'">
  <span>${name}</span>
</span>`;

    return hasLink
      ? `<a href="${profileLink}" target="_blank" rel="noopener noreferrer" class="no-underline inline-block align-middle">${content}</a>`
      : content;
  });

  // 영화 카드 shortcode (OMDb API 연동)
  eleventyConfig.addShortcode("movie", async function (title, imdbId, posterUrl = "") {
    const env = require("./src/_data/env.js");
    const apiKey = env.omdbApiKey;

    // 캐시 디렉토리 생성
    const cacheDir = path.join(__dirname, ".cache");
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    const cacheFile = path.join(cacheDir, `movie-${imdbId}.json`);
    let movieData = null;

    // 캐시 확인
    if (fs.existsSync(cacheFile)) {
      try {
        const cached = JSON.parse(fs.readFileSync(cacheFile, "utf-8"));
        // 캐시가 7일 이내면 사용
        if (Date.now() - cached.timestamp < 7 * 24 * 60 * 60 * 1000) {
          movieData = cached.data;
        }
      } catch (e) {
        console.warn(`⚠️  캐시 읽기 실패: ${imdbId}`);
      }
    }

    // API 호출 (캐시가 없거나 만료된 경우)
    if (!movieData && apiKey) {
      try {
        const fetch = (await import("node-fetch")).default;
        const response = await fetch(`https://www.omdbapi.com/?i=${imdbId}&apikey=${apiKey}`);
        movieData = await response.json();

        if (movieData.Response === "True") {
          // 캐시 저장
          fs.writeFileSync(cacheFile, JSON.stringify({
            timestamp: Date.now(),
            data: movieData
          }));
          console.log(`✅ 영화 정보 가져옴: ${movieData.Title}`);
        } else {
          console.warn(`⚠️  OMDb API 오류: ${movieData.Error}`);
          movieData = null;
        }
      } catch (error) {
        console.error(`❌ OMDb API 호출 실패: ${error.message}`);
        movieData = null;
      }
    }

    // 데이터 추출
    const movieTitle = movieData?.Title || title;
    const year = movieData?.Year || "";
    const poster = posterUrl || movieData?.Poster || `https://via.placeholder.com/300x450?text=${encodeURIComponent(movieTitle)}`;
    const imdbRating = movieData?.imdbRating || "";
    const imdbLink = `https://www.imdb.com/title/${imdbId}/`;

    // 로튼 토마토 점수 추출
    let rottenTomatoesScore = "";
    if (movieData?.Ratings) {
      const rtRating = movieData.Ratings.find(r => r.Source === "Rotten Tomatoes");
      if (rtRating) {
        rottenTomatoesScore = rtRating.Value;
      }
    }

    // HTML 생성
    return `<div class="movie-card not-prose my-6 p-4 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow bg-white">
  <div class="flex gap-4">
    <a href="${imdbLink}" target="_blank" rel="noopener noreferrer" class="flex-shrink-0">
      <img src="${poster}" 
           alt="${movieTitle} 포스터" 
           class="w-24 h-36 object-cover rounded shadow-sm hover:shadow-md transition-shadow"
           onerror="this.src='https://via.placeholder.com/300x450?text=${encodeURIComponent(movieTitle)}'">
    </a>
    <div class="flex-1 min-w-0">
      <h3 class="text-lg font-bold text-gray-900 mb-1">
        <a href="${imdbLink}" target="_blank" rel="noopener noreferrer" class="hover:text-primary-600 transition-colors">
          ${movieTitle}${year ? ` (${year})` : ""}
        </a>
      </h3>
      <div class="flex flex-wrap gap-3 mt-3">
        ${imdbRating ? `
        <div class="flex items-center gap-1.5">
          <span class="text-yellow-500 font-bold text-sm">⭐</span>
          <span class="text-sm font-semibold text-gray-700">${imdbRating}</span>
          <span class="text-xs text-gray-500">IMDb</span>
        </div>` : ""}
        ${rottenTomatoesScore ? `
        <div class="flex items-center gap-1.5">
          <span class="text-red-500 font-bold text-sm">🍅</span>
          <span class="text-sm font-semibold text-gray-700">${rottenTomatoesScore}</span>
          <span class="text-xs text-gray-500">RT</span>
        </div>` : ""}
      </div>
      ${!apiKey ? `<p class="text-xs text-gray-400 mt-2">💡 OMDb API 키를 설정하면 평점이 표시됩니다</p>` : ""}
    </div>
  </div>
</div>`;
  });

  // 다국어 번역 필터
  eleventyConfig.addFilter("t", function (key, lang = "ko") {
    const i18n = require("./src/_data/i18n.js");
    const keys = key.split(".");
    let value = i18n[lang] || i18n.ko;

    for (const k of keys) {
      value = value?.[k];
      if (!value) return key;
    }

    return value || key;
  });

  // 현재 언어 가져오기 (페이지 front matter 또는 기본값)
  eleventyConfig.addFilter("getLang", function (page) {
    return page?.data?.lang || "ko";
  });

  // 언어별 포스트 필터링
  eleventyConfig.addFilter("filterByLang", function (collection, lang) {
    return collection.filter(item => {
      const itemLang = item.data.lang || "ko";
      return itemLang === lang;
    });
  });

  // Permalink 중복 체크 (빌드 완료 후)
  eleventyConfig.on('eleventy.after', async () => {
    // 중복 체크 경고
    if (duplicates.length > 0) {
      console.warn('\n⚠️  WARNING: Duplicate permalinks detected!\n');
      duplicates.forEach(dup => {
        console.warn(`   - ${dup.permalink}`);
        dup.files.forEach(file => {
          console.warn(`     → ${file}`);
        });
        console.warn('');
      });

      // JSON 파일로 저장
      const outputPath = path.join('_site', 'permalink-duplicates.json');
      fs.writeFileSync(outputPath, JSON.stringify(duplicates, null, 2));
      console.warn(`   Details saved to: ${outputPath}\n`);
    }

    // 리다이렉션 파일 생성
    await generateRedirects();
  });

  // 리다이렉션 생성 함수
  async function generateRedirects() {
    const redirects = [];

    // permalinkMap을 순회하며 리다이렉션 규칙 생성
    permalinkMap.forEach((inputPath, newUrl) => {
      // 파일명에서 숫자 prefix가 있는지 확인
      const fileName = path.basename(inputPath, '.md');
      const hasNumberPrefix = /^\d+-/.test(fileName);

      if (hasNumberPrefix) {
        // 기존 URL 패턴 생성 (파일명 기반)
        const match = inputPath.match(/posts\/(\d{4})\/([\w-]+)\.md$/);
        if (match) {
          const year = match[1];
          const fileSlug = match[2];
          const oldUrl = `/posts/${year}/${fileSlug}/`;

          // 새 URL과 다른 경우에만 리다이렉션 추가
          if (oldUrl !== newUrl) {
            redirects.push(`${oldUrl}* ${newUrl}:splat 301`);
          }
        }
      }
    });

    // _redirects 파일 생성
    if (redirects.length > 0) {
      const redirectsPath = path.join('_site', '_redirects');
      const content = [
        '# Auto-generated redirects for SEO-friendly URLs',
        '# Old URLs (with number prefix) -> New URLs (slug-based)',
        '',
        ...redirects
      ].join('\n');

      fs.writeFileSync(redirectsPath, content);
      console.log(`✅ Generated ${redirects.length} redirect rules in _site/_redirects`);
    }
  }

  // 컬렉션
  eleventyConfig.addCollection("blog", function (collection) {
    // 하위 디렉토리 포함 (src/posts/**/*.md)
    let posts = collection.getFilteredByGlob("src/posts/**/*.md");

    // draft 필터링 (프로덕션에서만)
    if (process.env.ELEVENTY_ENV === 'production') {
      posts = posts.filter(post => !post.data.draft);
    }

    // Permalink 중복 체크
    posts.forEach(post => {
      const permalink = post.url;
      const inputPath = post.inputPath;

      if (permalinkMap.has(permalink)) {
        const existing = permalinkMap.get(permalink);
        const existingDup = duplicates.find(d => d.permalink === permalink);

        if (existingDup) {
          existingDup.files.push(inputPath);
        } else {
          duplicates.push({
            permalink: permalink,
            files: [existing, inputPath]
          });
        }
      } else {
        permalinkMap.set(permalink, inputPath);
      }
    });

    return posts.sort(function (a, b) {
      return b.date - a.date;
    });
  });

  // 언어별 컬렉션
  eleventyConfig.addCollection("blog_ko", function (collection) {
    let posts = collection.getFilteredByGlob("src/posts/**/*.md");
    if (process.env.ELEVENTY_ENV === 'production') {
      posts = posts.filter(post => !post.data.draft);
    }
    return posts.filter(post => {
      const lang = post.data.lang || "ko";
      return lang === "ko";
    }).sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("blog_en", function (collection) {
    let posts = collection.getFilteredByGlob("src/posts/**/*.md");
    if (process.env.ELEVENTY_ENV === 'production') {
      posts = posts.filter(post => !post.data.draft);
    }
    return posts.filter(post => {
      const lang = post.data.lang || "ko";
      return lang === "en";
    }).sort((a, b) => b.date - a.date);
  });

  // 카테고리별 컬렉션 (언어별 필터링 + 날짜 정렬)
  eleventyConfig.addCollection("스포일러 지뢰찾기", function (collection) {
    return collection.getAll()
      .filter(item => item.data.category === "스포일러 지뢰찾기")
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("아는 척하기 딱 좋은", function (collection) {
    return collection.getAll()
      .filter(item => item.data.category === "아는 척하기 딱 좋은")
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("컨트롤이 안 되면 머리로", function (collection) {
    return collection.getAll()
      .filter(item => item.data.category === "컨트롤이 안 되면 머리로")
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("여기도 한국이었어?", function (collection) {
    return collection.getAll()
      .filter(item => item.data.category === "여기도 한국이었어?")
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("비행기 값이 안 아까운", function (collection) {
    return collection.getAll()
      .filter(item => item.data.category === "비행기 값이 안 아까운")
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("나만 당할 수 없지", function (collection) {
    return collection.getAll()
      .filter(item => item.data.category === "나만 당할 수 없지")
      .sort((a, b) => b.date - a.date);
  });

  // 태그별 컬렉션
  eleventyConfig.addCollection("tagList", function (collection) {
    let tagSet = new Set();
    collection.getAll().forEach(item => {
      (item.data.tags || []).forEach(tag => {
        if (tag !== "blog" && tag !== "post") {
          tagSet.add(tag);
        }
      });
    });
    return Array.from(tagSet).sort();
  });

  // 카테고리 목록 (이름과 슬러그 분리)
  eleventyConfig.addGlobalData("categoryList", [
    { name: "스포일러 지뢰찾기", slug: "news" },
    { name: "아는 척하기 딱 좋은", slug: "tmi" },
    { name: "컨트롤이 안 되면 머리로", slug: "games" },
    { name: "여기도 한국이었어?", slug: "domestic" },
    { name: "비행기 값이 안 아까운", slug: "abroad" },
    { name: "나만 당할 수 없지", slug: "pro-tip" }
  ]);

  // 빌드타임 Mermaid 변환: HTML 출력에서 `language-mermaid` 코드블록을 찾아 SVG로 변환하여 인라인합니다.
  const { execSync } = require('child_process');
  const crypto = require('crypto');
  eleventyConfig.addTransform('mermaid', function(content, outputPath) {
    if (!outputPath || !outputPath.endsWith('.html')) return content;
    if (!content.includes('language-mermaid')) return content;

    return content.replace(/<pre[^>]*><code class="language-mermaid">([\s\S]*?)<\/code><\/pre>/g, (m, code) => {
      // `code` may contain HTML produced by syntax highlighters (e.g. <span>..</span>).
      // Remove any HTML tags and unescape common entities so Mermaid gets plain text.
      const decoded = code.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
      // Replace tags with a single space to avoid token concatenation, then
      // normalize spaces while preserving newlines.
      let cleaned = decoded.replace(/<[^>]+>/g, ' ');
      cleaned = cleaned.replace(/\r\n/g, '\n').replace(/[ \t]+/g, ' ').replace(/ *\n */g, '\n').trim();
      // Convert literal "\n" sequences (from author-written escapes) into <br>
      // which Mermaid accepts inside node labels.
      cleaned = cleaned.replace(/\\n/g, '<br>');
      // Mermaid CLI(mermaid-cli/mmdc)는 `A [label]`처럼 노드 ID와 `[` 사이에 공백이 있으면
      // 파싱 에러를 내는 경우가 있습니다. 브라우저 렌더러는 관대하지만 빌드타임 변환은 엄격하므로,
      // `A [..]`, `A (..)`, `A {..}` 형태를 `A[..]` 등으로 정규화합니다.
      cleaned = cleaned
        .replace(/\b([A-Za-z0-9_]+)\s+\[/g, '$1[')
        .replace(/\b([A-Za-z0-9_]+)\s+\(/g, '$1(')
        .replace(/\b([A-Za-z0-9_]+)\s+\{/g, '$1{');
      // mermaid-cli(구버전 mermaid 파서)는 일부 유니코드 화살표(→ 등)를 토큰으로 처리하지 못해
      // lexical error를 내는 경우가 있습니다. 라벨 텍스트에서 안전한 ASCII로 치환합니다.
      cleaned = cleaned
        .replace(/→/g, '->')
        .replace(/←/g, '<-')
        .replace(/↔/g, '<->');
      const hash = crypto.createHash('md5').update(cleaned).digest('hex');
      const cacheDir = path.join(__dirname, '.cache', 'mermaid');
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
      const mmdFile = path.join(cacheDir, `${hash}.mmd`);
      const svgFile = path.join(cacheDir, `${hash}.svg`);

      if (!fs.existsSync(svgFile)) {
        fs.writeFileSync(mmdFile, cleaned);
        try {
          const mmdcBin = path.join(__dirname, 'node_modules', '.bin', 'mmdc');
          // Use local mmdc if available, otherwise fallback to npx
          const cmd = fs.existsSync(mmdcBin) ? `${mmdcBin} -i ${mmdFile} -o ${svgFile}` : `npx --yes mmdc -i ${mmdFile} -o ${svgFile}`;
          execSync(cmd, { stdio: 'ignore' });
        } catch (e) {
          console.warn('⚠️  mermaid-cli failed to render diagram:', e.message);
          return `<pre><code class="language-mermaid">${code}</code></pre>`;
        }
      }

      try {
        const svg = fs.readFileSync(svgFile, 'utf8');
        return svg;
      } catch (e) {
        console.warn('⚠️  Failed to read generated SVG for mermaid diagram:', e.message);
        return `<pre><code class="language-mermaid">${code}</code></pre>`;
      }
    });
  });

  // 읽기 시간 자동 계산
  eleventyConfig.addFilter("readingTime", function (content) {
    if (!content) return 0;

    // HTML 태그 제거
    const text = content.replace(/<[^>]*>/g, '');

    // 단어 수 계산 (한글/영문 혼합)
    const koreanChars = (text.match(/[\u3131-\uD79D]/g) || []).length;
    const words = text.split(/\s+/).filter(word => word.length > 0).length;

    // 한글: 500자/분, 영문: 200단어/분 기준
    const koreanMinutes = koreanChars / 500;
    const englishMinutes = words / 200;

    const totalMinutes = Math.ceil(koreanMinutes + englishMinutes);

    return totalMinutes > 0 ? totalMinutes : 1;
  });

  // 버튼 Shortcode (Tailwind 스타일 적용)
  eleventyConfig.addShortcode("button", function (text, url, variant = "accent") {
    const baseStyles = "inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-base font-bold rounded-lg shadow-sm transition-all duration-200 no-underline not-prose cursor-pointer my-4 transform hover:-translate-y-0.5 hover:shadow-md";

    let variantStyles = "";
    if (variant === "primary") {
      variantStyles = "text-white bg-primary-600 hover:bg-primary-700";
    } else if (variant === "accent") {
      variantStyles = "text-white bg-accent-400 hover:bg-accent-500";
    } else if (variant === "outline") {
      variantStyles = "text-primary-600 bg-white border-2 border-primary-600 hover:bg-primary-50";
    } else {
      variantStyles = "text-white bg-accent-400 hover:bg-accent-500";
    }

    // 외부 링크 판별 (http로 시작하거나 //로 시작할 경우)
    const isExternal = /^https?:\/\/|^\/\//i.test(url);
    const target = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';

    return `<div class="flex justify-center"><a href="${url}"${target} class="${baseStyles} ${variantStyles}">${text}</a></div>`;
  });

  // 유튜브 Shortcode (반응형 16:9)
  eleventyConfig.addShortcode("youtube", function (id, title = "YouTube video player") {
    // URL에서 ID만 추출하는 정규식
    let videoId = id;
    const urlPattern = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = id.match(urlPattern);
    if (match) videoId = match[1];

    return `<div class="youtube-wrapper not-prose my-8 relative pb-[56.25%] h-0 overflow-hidden rounded-xl shadow-lg border border-gray-200 bg-gray-100">
  <iframe 
    class="absolute top-0 left-0 w-full h-full"
    src="https://www.youtube.com/embed/${videoId}" 
    title="${title}" 
    frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    allowfullscreen>
  </iframe>
</div>`;
  });

  // Alert Shortcode (정보, 성공, 주의, 경고 박스)
  eleventyConfig.addPairedShortcode("alert", function (content, type = "info", title = "") {
    const typeConfig = {
      info: { icon: "💡", defaultTitle: "정보" },
      success: { icon: "✅", defaultTitle: "성공" },
      warning: { icon: "⚠️", defaultTitle: "주의" },
      danger: { icon: "🚨", defaultTitle: "경고" }
    };

    const config = typeConfig[type] || typeConfig.info;
    const displayTitle = title || config.defaultTitle;

    // markdown-it 인스턴스를 가져와서 content를 렌더링
    const markdownIt = require("markdown-it")({ html: true, breaks: true });
    const renderedContent = markdownIt.render(content.trim())
      // 연속된 </p><p>를 공백으로 변환 (같은 줄에 표시)
      .replace(/<\/p>\s*<p>/g, ' ')
      // 남은 <p>, </p> 태그 제거
      .replace(/<\/?p>/g, '');

    return `<div class="alert alert-${type}">
<strong class="alert-title">${config.icon} ${displayTitle}</strong>
${renderedContent}
</div>`;
  });

  // 설정 객체
  return {
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_layouts"
    }
  };
};

async function imageShortcode(src, alt) {
  let metadata = await Image(src, {
    widths: [300, 600, 1200],
    formats: ["webp", "jpeg"]
  });

  let imageAttributes = {
    alt,
    sizes: "(min-width: 1024px) 1024px, 100vw",
    loading: "lazy",
    decoding: "async",
  };

  return Image.generateHTML(metadata, imageAttributes);
}

// Cloudinary shortcode: 입력으로 Cloudinary URL(또는 upload/ 이후 경로)과 alt를 받습니다.
// 출력: LQIP 배경을 가진 wrapper + picture/img (f_auto,q_auto,dpr_auto 적용)
function cloudinaryShortcode(src, alt = "", sizes = "(max-width:720px) 100vw, 720px") {
  if (!src) return "";

  // src가 전체 URL인지, 아니면 upload/ 이후 경로인지 판별
  let base;
  let publicId;

  try {
    if (src.startsWith('http')) {
      const uploadIdx = src.indexOf('/image/upload/');
      if (uploadIdx === -1) {
        // URL이지만 Cloudinary 패턴을 못 찾으면 그대로 fallback
        base = src;
        publicId = '';
      } else {
        base = src.slice(0, uploadIdx + '/image/upload/'.length);
        publicId = src.slice(uploadIdx + '/image/upload/'.length);
      }
    } else {
      // 상대 경로로 전달된 경우(예: "v1234/path.jpg" 또는 "media/.."), 기본 도메인 사용
      base = 'https://res.cloudinary.com/doal3ofyr/image/upload/';
      publicId = src.replace(/^\//, '');
    }
  } catch (e) {
    return '';
  }

  const widths = [480, 768, 1024, 1365];
  const srcset = widths.map(w => `${base}f_auto,q_auto,w_${w},dpr_auto/${publicId} ${w}w`).join(', ');

  // 기본 src는 중간 크기
  const defaultWidth = 720;
  const srcDefault = `${base}f_auto,q_auto,w_${defaultWidth},dpr_auto/${publicId}`;

  // LQIP (작고 흐릿한 이미지)
  const lqip = `${base}f_auto,q_1,w_20,e_blur:200/${publicId}`;

  const escAlt = (alt || '').replace(/"/g, '&quot;');

  // wrapper의 background-image로 LQIP를 사용하고, 이미지 로드 완료 시 제거
  return `<div class="cloudinary-image not-prose my-6" style="background-image:url('${lqip}');background-size:cover;background-position:center;">
  <picture>
    <img src="${srcDefault}"
         srcset="${srcset}"
         sizes="${sizes}"
         alt="${escAlt}"
         loading="lazy"
         decoding="async"
         onload="this.parentNode.parentNode.style.backgroundImage='none'"/>
  </picture>
</div>`;
}
