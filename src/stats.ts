import icons from 'lucide-static';
import stats from '../assets/statistics.json' assert { type: 'json' };
import createImage, { fontMono, fontSans } from './image.ts';

const format = (value: string) =>
  Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 2 }).format(Number(value));

export default async function () {
  await createStatisticsImage('light');
  await createStatisticsImage('dark');
}

async function createStatisticsImage(theme: 'light' | 'dark') {
  const background = theme === 'dark' ? 'bg-black' : 'bg-white';
  const text1 = theme === 'dark' ? 'text-white' : 'text-black';
  const text2 = theme === 'dark' ? 'text-neutral-300' : 'text-neutral-900';
  const text3 = theme === 'dark' ? 'text-neutral-400' : 'text-neutral-700';
  const border = theme === 'dark' ? 'border border-neutral-200' : 'border border-neutral-800';

  const template = `
    <div class="flex flex-col relative w-full h-full p-20 text-4xl ${text1}" ${fontSans}>
      <div class="flex items-center mb-14">
        <img src="${stats.avatarUrl}" width="120" height="120" class="rounded-full ${border} ${background}" />
        <div class="flex flex-col ml-8">
          <span class="text-5xl">Christian Penrod</span>
          <span class="${text2}">Joined ${stats.registration}</span>
        </div>
      </div>
      <div class="flex mb-12">
        <div class="flex flex-col mr-32">
          <div class="flex items-center mb-6">
            <span class="${text3}" style="transform:scale(1.5)">${icons.Users}</span>
            <span class="ml-6 mr-8 ${text2}">Followers:</span>
            <span ${fontMono}>${format(stats.followers)}</span>
          </div>
          <div class="flex items-center mb-6">
            <span class="${text3}" style="transform:scale(1.5)">${icons.Star}</span>
            <span class="ml-6 mr-8 ${text2}">Stargazers:</span>
            <span ${fontMono}>${format(stats.stargazers)}</span>
          </div>
          <div class="flex items-center mb-6">
            <span class="${text3}" style="transform:scale(1.5)">${icons.GitFork}</span>
            <span class="ml-6 mr-8 ${text2}">Forkers:</span>
            <span ${fontMono}>${format(stats.forkers)}</span>
          </div>
          <div class="flex items-center mb-6">
            <span class="${text3}" style="transform:scale(1.5)">${icons.Eye}</span>
            <span class="ml-6 mr-8 ${text2}">Watchers:</span>
            <span ${fontMono}>${format(stats.watchers)}</span>
          </div>
        </div>
        <div class="flex flex-col">
          <div class="flex items-center mb-6">
            <span class="${text3}" style="transform:scale(1.5)">${icons.GitPullRequest}</span>
            <span class="ml-6 mr-8 ${text2}">Pull Requests:</span>
            <span ${fontMono}>${format(stats.pullRequests)}</span>
          </div>
          <div class="flex items-center mb-6">
            <span class="${text3}" style="transform:scale(1.5)">${icons.GitCommit}</span>
            <span class="ml-6 mr-8 ${text2}">Commits:</span>
            <span ${fontMono}>${format(stats.commits)}</span>
          </div>
          <div class="flex items-center mb-6">
            <span class="${text3}" style="transform:scale(1.5)">${icons.Folder}</span>
            <span class="ml-6 mr-8 ${text2}">Repositories:</span>
            <span ${fontMono}>${format(stats.repositories)}</span>
          </div>
          <div class="flex items-center mb-6">
            <span class="${text3}" style="transform:scale(1.5)">${icons.Database}</span>
            <span class="ml-6 mr-8 ${text2}">Repository Storage:</span>
            <span ${fontMono}>${format((Number(stats.repositoriesStorage) / 1024).toString())} MB</span>
          </div>
        </div>
      </div>
      <em class="text-3xl ${text3}">Last Updated: ${new Date().toLocaleDateString('en-US')}</em>
    </div>
  `;

  await createImage(template, {
    width: 1920,
    height: 660,
    backgroundImage: `statistics-background.${theme}`,
    filename: `statistics.${theme}`,
  });
}
