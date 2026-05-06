const theme = require("@veryfaraway/eleventy-theme");

module.exports = function (eleventyConfig) {
  // Shared theme (build-time mermaid, unified permalink, selectable comments)
  // All common shortcodes (youtube, cloudinary, movie, person, personInline, button)
  // are registered by the theme plugin.
  const baseConfig = theme(eleventyConfig, {
    comments: { provider: "auto", utterances: { theme: "github-light", issueTerm: "pathname" } },
    mermaid: { enabled: true, mode: "buildtime" },
    permalink: { mode: "computed", stripNumericPrefix: true, enableLangParam: false },
    redirects: { enabled: true },
  });

  // Popcorn: category collections
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
