import { config as setupEnv } from 'dotenv';
import { renderFile } from 'ejs';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { getGithub } from './utils/get-github';
import { getPosts } from './utils/get-posts';

setupEnv();

try {
  const posts = await getPosts();
  const github = await getGithub();

  const path = join(process.cwd(), 'src/templates/README.ejs');
  writeFileSync('README.md', await renderFile(path, { posts, github }));
} catch (e) {
  console.error(e);
}
