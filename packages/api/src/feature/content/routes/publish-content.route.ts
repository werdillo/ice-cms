import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import type { z } from 'zod'
import { publishContentSchema } from '../schemas/publish.schema'
import { publishPageDataToGitHub } from '../services/github-content.service'
import {
  getGithubContentConfig,
  type ContentEnv,
} from '../services/content.config.service'

export type PublishContentRequest = z.infer<typeof publishContentSchema>

const publishContentRoute = new Hono<{ Bindings: ContentEnv }>()

publishContentRoute.post(
  '/publish',
  zValidator('json', publishContentSchema),
  async (c) => {
    const payload = c.req.valid('json')

    try {
      const config = getGithubContentConfig(c.env)

      const result = await publishPageDataToGitHub(
        {
          ...config,
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

export { publishContentRoute }
export default publishContentRoute
