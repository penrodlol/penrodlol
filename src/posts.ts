import Parser from 'rss-parser';
import z from 'zod';
import env from './env.ts';

export default async function () {
  const rss = await new Parser().parseURL(new URL('rss.xml', env.WEBSITE).href);
  if (!rss.items) throw new Error('No items found in RSS feed');

  const posts = z.array(z.object({ title: z.string(), link: z.string().url() })).safeParse(rss.items);
  if (!posts.success) throw new Error(posts.error.message);
  return posts.data.slice(0, 4);
}
