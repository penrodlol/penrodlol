import { writeFile } from 'node:fs/promises';
import getPosts from './posts.ts';
import createStats from './stats.ts';

const version = crypto.randomUUID();
const posts = await getPosts();

await createStats();

const template = `
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/banner.dark.png?v=${version}" />
  <source media="(prefers-color-scheme: light)" srcset="assets/banner.light.png?v=${version}" />
  <img src="assets/banner.dark.png?v=${version}" alt="Banner" />
</picture>
<br />
<br />
<br />
<h2>GITHUB STATISTICS</h2>
<p>I work on random side projects and open source software in my free time. Below are some statistics around that.</p>
<picture>
  <source media="(min-width: 601px)" srcset="assets/statistics.png?v=${version}" />
  <source media="(max-width: 600px)" srcset="assets/statistics.png?v=${version}" />
  <img src="assets/statistics.png?v=${version}" alt="Github Statistics" />
</picture>
<br />
<br />
<br />
<h2>Recently Published</h2>
<p>I write about web development and developer experience tooling. Below are some of the most recent articles published.</p>
${posts
  .map(
    (post) =>
      `<a href="${post.link}">` +
      '<picture>' +
      `<source media="(min-width: 601px)" srcset="${post.link}.png?v=${version}" width="48%" />` +
      `<source media="(max-width: 600px)" srcset="${post.link}.png?v=${version}" width="100%" />` +
      `<img src="assets/banner.dark.png?v=${version}" alt="${post.title}" width="100%" />` +
      '</picture>' +
      '</a>',
  )
  .join('\n')}
`;

await writeFile('README.md', template);
