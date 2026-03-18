import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import type { z } from 'zod'
import { publishContentSchema } from '../schemas/publish.schema'
import { publishPageDataToGitHub } from '../services/github-content.service'

export type ContentPublishEnv = {
  GITHUB_TOKEN: string
  GITHUB_OWNER: string
  GITHUB_REPO: string
  GITHUB_BRANCH?: string
  FRONTEND_CONTENT_PATH?: string
}

export type PublishRequest = z.infer<typeof publishContentSchema>

const publishRoute = new Hono<{ Bindings: ContentPublishEnv }>()

publishRoute.post(
  '/publish',
  zValidator('json', publishContentSchema),
  async (c) => {
    const payload = c.req.valid('json')

    const {
      GITHUB_TOKEN,
      GITHUB_OWNER,
      GITHUB_REPO,
      GITHUB_BRANCH,
      FRONTEND_CONTENT_PATH,
    } = c.env

    if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
      return c.json(
        {
          success: false,
          error:
            'Missing GitHub configuration. Required: GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO',
        },
        500
      )
    }

    try {
      const result = await publishPageDataToGitHub(
        {
          token: GITHUB_TOKEN,
          owner: GITHUB_OWNER,
          repo: GITHUB_REPO,
          branch: GITHUB_BRANCH ?? 'main',
          contentPath: FRONTEND_CONTENT_PATH ?? 'src/content/pages',
          commitMessage: payload.commitMessage,
        },
        {
          slug: payload.slug,
          data: payload.content,
        }
      )

      return c.json({
        success: true,
        message: 'Page content published successfully',
        data: result,
      })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to publish content'

      return c.json(
        {
          success: false,
          error: message,
        },
        500
      )
    }
  }
)

export { publishRoute }
export default publishRoute
