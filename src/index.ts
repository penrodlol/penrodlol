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
      pubDate: z.string().transform((date) => new Date(date).valueOf()),
    }),
  )
  .refine((r) => r.sort((a, b) => b.pubDate - a.pubDate).slice(0, 5))
  .safeParse(rss.items);

if (posts.success) {
  const path = join(process.cwd(), 'src/templates/README.ejs');
  writeFileSync('README.md', await renderFile(path, { posts: posts.data }));
}
