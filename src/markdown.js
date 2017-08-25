// Ported from webpack.js.org
import marked from "marked";
import * as parse from "./parse";

const noop = () => {};

function markdown(customize = noop) {
  const renderer = new marked.Renderer();

  renderer.image = function image(href, title, text) {
    const textParts = text ? text.split("|") : [];
    const alt = textParts[0] || "";
    const width = textParts[1] || "";
    const height = textParts[2] || "";
    const className = textParts[3] || "";

    return `<img src="__IMG_START__${href}__IMG_END__" alt="${alt}" class="${className}" width="${width}" height="${height}" />`;
  };

  // patch ids (this.options.headerPrefix can be undefined!)
  renderer.heading = function heading(text, level, raw) {
    const id = raw.toLowerCase().replace(/`/g, "").replace(/[^\w]+/g, "-");

    return (
      `<h${level} class="header">` +
      `<a class="header-anchor" href="#${id}" id="${id}"></a>` +
      `<span class="text">${text}</span>` +
      `<a class="header-anchor-select" href="#${id}">#</a>` +
      `</h${level}>\n`
    );
  };

  renderer.paragraph = function paragraph(text) {
    // Skip pagebreaks
    if (text === "{pagebreak}") {
      return "";
    }

    return `<p>${text}</p>\n`;
  };

  customize(renderer);

  return {
    process(content, highlight) {
      const markedDefaults = {
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: false,
        sanitizer: null,
        mangle: true,
        smartLists: false,
        silent: false,
        highlight: highlight || false,
        langPrefix: "lang-",
        smartypants: false,
        headerPrefix: "",
        renderer,
        xhtml: false
      };

      return marked.parser(parse.quotes(content), markedDefaults);
    },

    // Note that this should correspond with renderer.heading
    getAnchors(content) {
      return marked
        .lexer(content)
        .filter(chunk => chunk.type === "heading")
        .map(chunk => ({
          title: chunk.text.replace(/`/g, ""),
          id: chunk.text.toLowerCase().replace(/`/g, "").replace(/[^\w]+/g, "-")
        }));
    }
  };
}

export default markdown;
