import { graphql } from '@octokit/graphql';
import { z } from 'zod';

export const getGithub = async () => {
  const authorization = `token ${process.env.GH_ACCESS_TOKEN}`;
  const yearAgo = new Date().setFullYear(new Date().getFullYear() - 1);
  const from = new Date(yearAgo).toISOString();
  const payload = await graphql.defaults({ headers: { authorization } })(`
    query {
      user(login: "penrodlol") {
        commits: contributionsCollection(from: "${from}") { total: totalCommitContributions }
        pullRequests(first: 1) { total: totalCount }
        issues { total: totalCount }
        contributed: repositoriesContributedTo(
          first: 1 contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, REPOSITORY]) { total: totalCount }
        stars: repositories(ownerAffiliations: OWNER last: 100 orderBy: { direction: DESC, field: STARGAZERS }) {
            total: nodes { stars: stargazers { total: totalCount } } }
      }
    }
  `);

  const github = z
    .object({
      commits: z.object({ total: z.number() }),
      pullRequests: z.object({ total: z.number() }),
      issues: z.object({ total: z.number() }),
      contributed: z.object({ total: z.number() }),
      stars: z.object({
        total: z
          .array(z.object({ stars: z.object({ total: z.number() }) }))
          .transform((n) => n.reduce((t, { stars }) => t + stars.total, 0)),
      }),
    })
    .safeParse((payload as Record<string, unknown>).user);

  if (!github.success) throw new Error(github.error.message);

  return github.data;
};
