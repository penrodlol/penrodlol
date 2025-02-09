import satori from 'satori';
import { html } from 'satori-html';
import sharp from 'sharp';

export type CreateImageOptions = { width: number; height: number; backgroundImage: string; filename: string };

export const fontSans = 'style="font-family:sans"';
export const fontMono = 'style="font-family:mono"';

export default async function (template: string, { width, height, backgroundImage, filename }: CreateImageOptions) {
  const sans = await fetch('https://cdn.jsdelivr.net/fontsource/fonts/geist-sans@latest/latin-400-normal.woff');
  const mono = await fetch('https://cdn.jsdelivr.net/fontsource/fonts/geist-mono@latest/latin-600-normal.woff');

  const svg = await satori(html(template), {
    width,
    height,
    fonts: [
      { name: 'sans', data: await sans.arrayBuffer(), style: 'normal', weight: 400 },
      { name: 'mono', data: await mono.arrayBuffer(), style: 'normal', weight: 600 },
    ],
  });

  return sharp(`assets/${backgroundImage}.png`)
    .resize(width, height)
    .composite([{ input: Buffer.from(svg) }])
    .png({ quality: 100 })
    .toFile(`assets/${filename}.png`);
}
