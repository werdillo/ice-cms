import type { PageData } from '@ice-cms/schemas'

export type GithubContentCommitConfig = {
  owner: string
  repo: string
  branch: string
  token: string
  contentPath: string
  commitMessage?: string
}

export type GithubContentFileResponse = {
  sha: string
  content?: string
}

export type GithubPublishPageInput = {
  slug: string
  data: PageData
}

export type GithubPublishPageResult = {
  success: true
  path: string
  sha: string
  commit: {
    message: string
  }
}

function toBase64(value: string): string {
  const bytes = new TextEncoder().encode(value)
  let binary = ''

  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }

  return btoa(binary)
}

function buildGitHubApiUrl(config: GithubContentCommitConfig, path: string): string {
  const encodedPath = path
    .split('/')
    .map(encodeURIComponent)
    .join('/')

  return `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${encodedPath}`
}

function buildTargetPath(config: GithubContentCommitConfig, slug: string): string {
  const normalizedBase = config.contentPath.replace(/^\/+|\/+$/g, '')
  const normalizedSlug = slug.replace(/^\/+|\/+$/g, '') || 'index'

  return `${normalizedBase}/${normalizedSlug}.json`
}

async function getExistingFile(
  config: GithubContentCommitConfig,
  path: string
): Promise<GithubContentFileResponse | null> {
  const response = await fetch(
    `${buildGitHubApiUrl(config, path)}?ref=${encodeURIComponent(config.branch)}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${config.token}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'ice-cms-api',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    }
  )

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(
      `Failed to fetch existing file from GitHub: ${response.status} ${errorText}`
    )
  }

  return (await response.json()) as GithubContentFileResponse
}

export async function publishPageDataToGitHub(
  config: GithubContentCommitConfig,
  input: GithubPublishPageInput
): Promise<GithubPublishPageResult> {
  const path = buildTargetPath(config, input.slug)
  const existingFile = await getExistingFile(config, path)
  const content = JSON.stringify(input.data, null, 2) + '\n'
  const commitMessage =
    config.commitMessage ?? `chore(content): publish page "${input.slug}"`

  const response = await fetch(buildGitHubApiUrl(config, path), {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${config.token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'User-Agent': 'ice-cms-api',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify({
      message: commitMessage,
      content: toBase64(content),
      branch: config.branch,
      ...(existingFile?.sha ? { sha: existingFile.sha } : {}),
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(
      `Failed to commit content to GitHub: ${response.status} ${errorText}`
    )
  }

  const json = (await response.json()) as {
    content: { path: string; sha: string }
    commit: { message: string }
  }

  return {
    success: true,
    path: json.content.path,
    sha: json.content.sha,
    commit: {
      message: json.commit.message,
    },
  }
}
