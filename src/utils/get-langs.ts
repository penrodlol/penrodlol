import fetch from 'node-fetch';
import { z } from 'zod';

export const getLangs = async () => {
  const domain = 'https://wakatime.com';
  const endpoint = 'api/v1/users/current/stats/last_30_days';
  const url = `${domain}/${endpoint}?api_key=${process.env.WAKATIME_API_KEY}`;
  const payload = await fetch(url).then(async (res) => {
    if (!res.ok) throw new Error(res.statusText);
    return res.json() as Promise<Record<string, unknown>>;
  });

  const stats = z
    .object({
      languages: z
        .array(z.object({ name: z.string(), text: z.string() }))
        .transform((languages) => languages.slice(0, 3)),
    })
    .safeParse(payload.data);

  if (!stats.success) throw new Error(stats.error.message);

  return stats.data.languages;
};
