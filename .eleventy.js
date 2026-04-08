const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {

  // ── Passthrough copies (CSS, JS, images, fonts go straight to _site) ──
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("public");

  // ── Date filters ──
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("dd LLL yyyy");
  });

  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-LL-dd");
  });

  // ── Word count → reading time ──
  eleventyConfig.addFilter("readingTime", (content) => {
    const words = content.split(/\s+/).length;
    const mins = Math.ceil(words / 200);
    return `${mins} min read`;
  });

  // ── Limit filter (used in homepage "latest posts" preview) ──
  eleventyConfig.addFilter("limit", (arr, limit) => arr.slice(0, limit));

  // ── Truncate text ──
  eleventyConfig.addFilter("truncate", (str, len) => {
    if (!str || str.length <= len) return str;
    return str.slice(0, len).replace(/\s\S*$/, '') + '…';
  });

  // ── Strip HTML tags ──
  eleventyConfig.addFilter("striptags", (str) => {
    return str ? str.replace(/<[^>]*>/g, '') : '';
  });

  // ── Collections ──
  eleventyConfig.addCollection("blog", function(collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/blog/*.md")
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("projects", function(collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/projects/*.md")
      .sort((a, b) => (a.data.order || 99) - (b.data.order || 99));
  });

  return {
    dir: {
      input:    "src",
      output:   "_site",
      includes: "_includes",
      layouts:  "_includes/layouts",
      data:     "_data",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine:     "njk",
    templateFormats: ["md", "njk", "html"],
  };
};
