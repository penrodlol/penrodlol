import { XMLParser } from "fast-xml-parser";
import { readFileSync, writeFileSync } from "fs";
import fetch from "node-fetch";

const parser = new XMLParser();

(async () => {
  const response = await fetch("https://christianpenrod.com/rss.xml");
  const xml = await response.text();
  const data = parser.parse(xml);
  const posts = data.rss.channel.item
    .sort((a, b) => {
      const aDate = new Date(a.pubDate).valueOf();
      const bDate = new Date(b.pubDate).valueOf();
      return bDate - aDate;
    })
    .slice(0, 3)
    .map((post) => ({ title: post.title, link: post.link }));

  const readme = readFileSync("README.md", "utf8");
  const newReadme = readme.replace(
    /<!-- POSTS_START -->[\s\S]*<!-- POSTS_END -->/,
    `<!-- POSTS_START -->\n${posts
      .map((post) => `➩ [${post.title}](${post.link})<br/>`)
      .join("\n")}\n<!-- POSTS_END -->`
  );

  writeFileSync("README.md", newReadme);
})();
