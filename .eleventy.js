const path = require("path");
const fs = require("fs");
const theme = require("@veryfaraway/eleventy-theme");

module.exports = function (eleventyConfig) {
  // Shared theme (build-time mermaid, unified permalink, selectable comments)
  const baseConfig = theme(eleventyConfig, {
    comments: { provider: "auto", utterances: { theme: "github-light", issueTerm: "pathname" } },
    mermaid: { enabled: true, mode: "buildtime" },
    permalink: { mode: "computed", stripNumericPrefix: true, enableLangParam: false },
    redirects: { enabled: true },
  });

  // Popcorn-only shortcodes/features
  eleventyConfig.addShortcode("cloudinary", cloudinaryShortcode);
  eleventyConfig.addShortcode("movie", movieShortcode);
  eleventyConfig.addShortcode("person", personCardShortcode);
  eleventyConfig.addShortcode("personInline", personInlineShortcode);
  eleventyConfig.addShortcode("button", buttonShortcode);
  eleventyConfig.addShortcode("youtube", youtubeShortcode);

  // Popcorn: category collections (kept as-is)
  eleventyConfig.addCollection("스포일러 지뢰찾기", function (collection) {
    return collection
      .getAll()
      .filter((item) => item.data.category === "스포일러 지뢰찾기")
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("아는 척하기 딱 좋은", function (collection) {
    return collection
      .getAll()
      .filter((item) => item.data.category === "아는 척하기 딱 좋은")
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("컨트롤이 안 되면 머리로", function (collection) {
    return collection
      .getAll()
      .filter((item) => item.data.category === "컨트롤이 안 되면 머리로")
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("여기도 한국이었어?", function (collection) {
    return collection
      .getAll()
      .filter((item) => item.data.category === "여기도 한국이었어?")
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("비행기 값이 안 아까운", function (collection) {
    return collection
      .getAll()
      .filter((item) => item.data.category === "비행기 값이 안 아까운")
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("나만 당할 수 없지", function (collection) {
    return collection
      .getAll()
      .filter((item) => item.data.category === "나만 당할 수 없지")
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addGlobalData("categoryList", [
    { name: "스포일러 지뢰찾기", slug: "news" },
    { name: "아는 척하기 딱 좋은", slug: "tmi" },
    { name: "컨트롤이 안 되면 머리로", slug: "games" },
    { name: "여기도 한국이었어?", slug: "domestic" },
    { name: "비행기 값이 안 아까운", slug: "abroad" },
    { name: "나만 당할 수 없지", slug: "pro-tip" },
  ]);

  return {
    ...baseConfig,
    dir: {
      ...baseConfig.dir,
      includes: "_includes",
      layouts: "_layouts",
    },
  };
};

// Cloudinary shortcode: 입력으로 Cloudinary URL(또는 upload/ 이후 경로)과 alt를 받습니다.
// 출력: LQIP 배경을 가진 wrapper + picture/img (f_auto,q_auto,dpr_auto 적용)
function cloudinaryShortcode(src, alt = "", sizes = "(max-width:720px) 100vw, 720px") {
  if (!src) return "";

  let base;
  let publicId;

  try {
    if (src.startsWith("http")) {
      const uploadIdx = src.indexOf("/image/upload/");
      if (uploadIdx === -1) {
        base = src;
        publicId = "";
      } else {
        base = src.slice(0, uploadIdx + "/image/upload/".length);
        publicId = src.slice(uploadIdx + "/image/upload/".length);
      }
    } else {
      base = "https://res.cloudinary.com/doal3ofyr/image/upload/";
      publicId = src.replace(/^\//, "");
    }
  } catch (e) {
    return "";
  }

  const widths = [480, 768, 1024, 1365];
  const srcset = widths
    .map((w) => `${base}f_auto,q_auto,w_${w},dpr_auto/${publicId} ${w}w`)
    .join(", ");

  const defaultWidth = 720;
  const srcDefault = `${base}f_auto,q_auto,w_${defaultWidth},dpr_auto/${publicId}`;
  const lqip = `${base}f_auto,q_1,w_20,e_blur:200/${publicId}`;
  const escAlt = (alt || "").replace(/"/g, "&quot;");

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

async function movieShortcode(title, imdbId, posterUrl = "") {
  const env = require("./src/_data/env.js");
  const apiKey = env.omdbApiKey;

  const cacheDir = path.join(__dirname, ".cache");
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }

  const cacheFile = path.join(cacheDir, `movie-${imdbId}.json`);
  let movieData = null;

  if (fs.existsSync(cacheFile)) {
    try {
      const cached = JSON.parse(fs.readFileSync(cacheFile, "utf-8"));
      if (Date.now() - cached.timestamp < 7 * 24 * 60 * 60 * 1000) {
        movieData = cached.data;
      }
    } catch (_e) {
      // ignore cache read failures
    }
  }

  if (!movieData && apiKey) {
    try {
      const fetch = (await import("node-fetch")).default;
      const response = await fetch(`https://www.omdbapi.com/?i=${imdbId}&apikey=${apiKey}`);
      movieData = await response.json();

      if (movieData.Response === "True") {
        fs.writeFileSync(
          cacheFile,
          JSON.stringify({ timestamp: Date.now(), data: movieData })
        );
      } else {
        movieData = null;
      }
    } catch (_error) {
      movieData = null;
    }
  }

  const movieTitle = movieData?.Title || title;
  const year = movieData?.Year || "";
  const poster =
    posterUrl ||
    movieData?.Poster ||
    `https://via.placeholder.com/300x450?text=${encodeURIComponent(movieTitle)}`;
  const imdbRating = movieData?.imdbRating || "";
  const imdbLink = `https://www.imdb.com/title/${imdbId}/`;

  let rottenTomatoesScore = "";
  if (movieData?.Ratings) {
    const rtRating = movieData.Ratings.find((r) => r.Source === "Rotten Tomatoes");
    if (rtRating) rottenTomatoesScore = rtRating.Value;
  }

  return `<div class="movie-card not-prose my-6 p-4 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow bg-white">
  <div class="flex gap-4">
    <a href="${imdbLink}" target="_blank" rel="noopener noreferrer" class="flex-shrink-0">
      <img src="${poster}"
           alt="${movieTitle} 포스터"
           class="w-24 h-36 object-cover rounded shadow-sm hover:shadow-md transition-shadow"
           onerror="this.src='https://via.placeholder.com/300x450?text=${encodeURIComponent(
             movieTitle
           )}'">
    </a>
    <div class="flex-1 min-w-0">
      <h3 class="text-lg font-bold text-gray-900 mb-1">
        <a href="${imdbLink}" target="_blank" rel="noopener noreferrer" class="hover:text-primary-600 transition-colors">
          ${movieTitle}${year ? ` (${year})` : ""}
        </a>
      </h3>
      <div class="flex flex-wrap gap-3 mt-3">
        ${
          imdbRating
            ? `<div class="flex items-center gap-1.5">
          <span class="text-yellow-500 font-bold text-sm">⭐</span>
          <span class="text-sm font-semibold text-gray-700">${imdbRating}</span>
          <span class="text-xs text-gray-500">IMDb</span>
        </div>`
            : ""
        }
        ${
          rottenTomatoesScore
            ? `<div class="flex items-center gap-1.5">
          <span class="text-red-500 font-bold text-sm">🍅</span>
          <span class="text-sm font-semibold text-gray-700">${rottenTomatoesScore}</span>
          <span class="text-xs text-gray-500">RT</span>
        </div>`
            : ""
        }
      </div>
      ${!apiKey ? `<p class="text-xs text-gray-400 mt-2">💡 OMDb API 키를 설정하면 평점이 표시됩니다</p>` : ""}
    </div>
  </div>
</div>`;
}

function personCardShortcode(name, role = "", image = "", link = "", imdb = "") {
  const imageUrl = image || `https://via.placeholder.com/60x60?text=${encodeURIComponent(name)}`;
  const profileLink = link || (imdb ? `https://www.imdb.com/name/${imdb}/` : "#");
  const hasLink = link || imdb;

  return `<div class="person-card not-prose my-3 p-2.5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all">
  <div class="flex items-center gap-2.5">
    <div class="flex-shrink-0">
      ${hasLink ? `<a href="${profileLink}" target="_blank" rel="noopener noreferrer">` : ""}
        <img src="${imageUrl}"
             alt="${name}"
             class="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
             onerror="this.src='https://via.placeholder.com/60x60?text=${encodeURIComponent(name)}'">
      ${hasLink ? "</a>" : ""}
    </div>
    <div class="flex-1 min-w-0">
      <h3 class="text-base font-bold text-gray-900 leading-tight">
        ${hasLink ? `<a href="${profileLink}" target="_blank" rel="noopener noreferrer" class="hover:text-primary-600 transition-colors">${name}</a>` : name}
      </h3>
      ${role ? `<p class="text-sm text-gray-600 mt-0.5">${role}</p>` : ""}
    </div>
  </div>
</div>`;
}

function personInlineShortcode(name, image = "", link = "", imdb = "") {
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
}

function buttonShortcode(text, url, variant = "accent") {
  const baseStyles =
    "inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-base font-bold rounded-lg shadow-sm transition-all duration-200 no-underline not-prose cursor-pointer my-4 transform hover:-translate-y-0.5 hover:shadow-md";

  let variantStyles = "";
  if (variant === "primary") variantStyles = "text-white bg-primary-600 hover:bg-primary-700";
  else if (variant === "accent") variantStyles = "text-white bg-accent-400 hover:bg-accent-500";
  else if (variant === "outline")
    variantStyles =
      "text-primary-600 bg-white border-2 border-primary-600 hover:bg-primary-50";
  else variantStyles = "text-white bg-accent-400 hover:bg-accent-500";

  const isExternal = /^https?:\/\/|^\/\//i.test(url);
  const target = isExternal ? ' target="_blank" rel="noopener noreferrer"' : "";

  return `<div class="flex justify-center"><a href="${url}"${target} class="${baseStyles} ${variantStyles}">${text}</a></div>`;
}

function youtubeShortcode(id, title = "YouTube video player") {
  let videoId = id;
  const urlPattern =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = String(id).match(urlPattern);
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
}

