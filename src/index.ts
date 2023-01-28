import dayjs from 'dayjs';
import { renderFile } from 'ejs';
import { writeFileSync } from 'fs';
import { join } from 'path';
import Parser from 'rss-parser';
import { z } from 'zod';

const rss = await new Parser().parseURL('https://christianpenrod.com/rss.xml');
const posts = z
  .array(
    z.object({
      title: z.string(),
      link: z.string(),
      pubDate: z.string().transform((date) => ({
        time: new Date(date).valueOf(),
        formatted: dayjs(date).format('MMMM D, YYYY'),
      })),
    }),
  )
  .refine((r) => r.sort((a, b) => b.pubDate.time - a.pubDate.time))
  .safeParse(rss.items);

if (posts.success) {
  const path = join(process.cwd(), 'src/templates/README.ejs');
  writeFileSync('README.md', await renderFile(path, { posts: posts.data }));
}
