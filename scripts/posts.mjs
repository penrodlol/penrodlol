import { XMLParser } from "fast-xml-parser";
import { readFileSync, writeFileSync } from "fs";
import fetch from "node-fetch";

const payload = await fetch("https://christianpenrod.com/rss.xml");

const rawRSS = await payload.text();
const parsedRSS = new XMLParser().parse(rawRSS).rss.channel.item;

const posts = parsedRSS
  .sort((a, b) => new Date(b.pubDate).valueOf() - new Date(a.pubDate).valueOf())
  .slice(0, 3);

const readme = readFileSync("README.md", "utf8");
const nextReadme = readme.replace(
  /<!-- POSTS_START -->[\s\S]*<!-- POSTS_END -->/,
  `<!-- POSTS_START -->\n${posts
    .map((post) => `➩ [${post.title}](${post.link})<br/>`)
    .join("\n")}\n<!-- POSTS_END -->`
);

writeFileSync("README.md", nextReadme);
