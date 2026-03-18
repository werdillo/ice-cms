export type ContentEnv = {
  GITHUB_TOKEN: string
  GITHUB_OWNER: string
  GITHUB_REPO: string
  GITHUB_BRANCH?: string
  FRONTEND_CONTENT_PATH?: string
}

export type GithubContentConfig = {
  token: string
  owner: string
  repo: string
  branch: string
  contentPath: string
}

export function getGithubContentConfig(env: ContentEnv): GithubContentConfig {
  const {
    GITHUB_TOKEN,
    GITHUB_OWNER,
    GITHUB_REPO,
    GITHUB_BRANCH,
    FRONTEND_CONTENT_PATH,
  } = env

  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    throw new Error(
      'Missing GitHub configuration. Required: GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO'
    )
  }

  return {
    token: GITHUB_TOKEN,
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    branch: GITHUB_BRANCH ?? 'main',
    contentPath: FRONTEND_CONTENT_PATH ?? 'src/content/pages',
  }
}
