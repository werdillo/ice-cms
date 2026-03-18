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
  encoding?: string
  path?: string
  name?: string
  download_url?: string | null
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

export type GithubReadPageInput = {
  slug: string
}

export type GithubReadPageResult = {
  success: true
  slug: string
  path: string
  sha: string
  data: PageData
}

function toBase64(value: string): string {
  const bytes = new TextEncoder().encode(value)
  let binary = ''

  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }

  return btoa(binary)
}

function fromBase64(value: string): string {
  const normalized = value.replace(/\n/g, '')
  const binary = atob(normalized)
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))

  return new TextDecoder().decode(bytes)
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

function buildGitHubHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'User-Agent': 'ice-cms-api',
    'X-GitHub-Api-Version': '2022-11-28',
  }
}

async function getExistingFile(
  config: GithubContentCommitConfig,
  path: string
): Promise<GithubContentFileResponse | null> {
  const response = await fetch(
    `${buildGitHubApiUrl(config, path)}?ref=${encodeURIComponent(config.branch)}`,
    {
      method: 'GET',
      headers: buildGitHubHeaders(config.token),
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

function parsePageDataFile(file: GithubContentFileResponse, slug: string): PageData {
  if (!file.content) {
    throw new Error(`GitHub file for slug "${slug}" does not contain content`)
  }

  if (file.encoding && file.encoding !== 'base64') {
    throw new Error(
      `Unsupported GitHub file encoding for slug "${slug}": ${file.encoding}`
    )
  }

  const decoded = fromBase64(file.content)

  try {
    return JSON.parse(decoded) as PageData
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown JSON parse error'

    throw new Error(`Failed to parse page content for slug "${slug}": ${message}`)
  }
}

export async function readPageDataFromGitHub(
  config: GithubContentCommitConfig,
  input: GithubReadPageInput
): Promise<GithubReadPageResult | null> {
  const path = buildTargetPath(config, input.slug)
  const file = await getExistingFile(config, path)

  if (!file) {
    return null
  }

  return {
    success: true,
    slug: input.slug,
    path,
    sha: file.sha,
    data: parsePageDataFile(file, input.slug),
  }
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
      ...buildGitHubHeaders(config.token),
      'Content-Type': 'application/json',
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
