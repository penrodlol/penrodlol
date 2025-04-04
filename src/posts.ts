import Parser from 'rss-parser';
import z from 'zod';

export default async function () {
  const rss = await new Parser().parseURL('https://christianpenrod.com/rss.xml');
  if (!rss.items) throw new Error('No items found in RSS feed');

  const posts = z.array(z.object({ title: z.string(), link: z.string().url() })).safeParse(rss.items);
  if (!posts.success) throw new Error(posts.error.message);
  return posts.data.slice(0, 4);
}
