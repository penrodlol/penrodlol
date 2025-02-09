import z from 'zod';

export default z.object({ WEBSITE: z.string().url() }).parse(process.env);
