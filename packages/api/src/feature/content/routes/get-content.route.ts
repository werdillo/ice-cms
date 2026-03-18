import { Hono } from 'hono'
import { readPageDataFromGitHub } from '../services/github-content.service'
import {
  getGithubContentConfig,
  type ContentEnv,
} from '../services/content.config.service'

const getContentRoute = new Hono<{ Bindings: ContentEnv }>()

getContentRoute.get('/:slug', async (c) => {
  const slug = c.req.param('slug')

  try {
    const config = getGithubContentConfig(c.env)
    const result = await readPageDataFromGitHub(config, { slug })

    if (!result) {
      return c.json(
        {
          success: false,
          error: `Content for slug "${slug}" not found`,
        },
        404
      )
    }

    return c.json({
      success: true,
      data: result,
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to load content'

    return c.json(
      {
        success: false,
        error: message,
      },
      500
    )
  }
})

export { getContentRoute }
export default getContentRoute
