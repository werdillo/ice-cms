import type { PageData } from '@ice-cms/schemas'

export type PublishContentRequest = {
  slug: string
  data: PageData
  commitMessage?: string
  targetPath?: string
}

export type PublishContentResult = {
  success: boolean
  slug: string
  path: string
  commitSha?: string
  commitUrl?: string
  message?: string
}

export type GitHubContentTarget = {
  owner: string
  repo: string
  branch: string
  token: string
  basePath?: string
}
