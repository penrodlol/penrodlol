import z from 'zod';

export default z
  .object({
    GITHUB_TOKEN: z.string(),
    GITHUB_USERNAME: z.string(),
    WEBSITE: z.string().url(),
  })
  .parse(process.env);
