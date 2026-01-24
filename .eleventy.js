const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const Image = require("@11ty/eleventy-img");

module.exports = function (eleventyConfig) {
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

  // 날짜 필터
  eleventyConfig.addFilter("dateFilter", function (date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
    const imageUrl = image || `https://via.placeholder.com/32x32?text=${encodeURIComponent(name)}`;
    const profileLink = link || (imdb ? `https://www.imdb.com/name/${imdb}/` : "#");
    const hasLink = link || imdb;

    const content = `<span class="inline-flex items-center gap-1 text-sm font-medium text-primary-700 hover:text-primary-800 underline-offset-4">
  <img src="${imageUrl}"
       alt="${name}"
       class="w-5 h-5 rounded-full object-cover border border-gray-200 inline-block align-middle"
       onerror="this.src='https://via.placeholder.com/32x32?text=${encodeURIComponent(name)}'">
  <span class="align-middle">${name}</span>
</span>`;

    return hasLink
      ? `<a href="${profileLink}" target="_blank" rel="noopener noreferrer" class="no-underline">${content}</a>`
      : content;
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

  // 컬렉션
  eleventyConfig.addCollection("blog", function (collection) {
    // 하위 디렉토리 포함 (src/posts/**/*.md)
    let posts = collection.getFilteredByGlob("src/posts/**/*.md");

    // draft 필터링 (프로덕션에서만)
    if (process.env.ELEVENTY_ENV === 'production') {
      posts = posts.filter(post => !post.data.draft);
    }

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
