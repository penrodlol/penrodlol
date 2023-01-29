import Parser from 'rss-parser';
import { z } from 'zod';

export const getPosts = async () => {
  const url = 'https://christianpenrod.com/rss.xml';
  const rss = await new Parser().parseURL(url);
  const posts = z
    .array(
      z.object({
        title: z.string(),
        link: z.string(),
        pubDate: z.string().transform((date) => new Date(date).valueOf()),
      }),
    )
    .refine((r) => r.sort((a, b) => b.pubDate - a.pubDate).slice(0, 5))
    .safeParse(rss.items);

  if (!posts.success) throw new Error(posts.error.message);

  return posts.data;
};
