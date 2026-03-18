import { Hono } from 'hono'
import { getContentRoute } from './get-content.route'
import {
  publishContentRoute,
  type PublishContentRequest,
} from './publish-content.route'
import type { ContentEnv } from '../services/content.config.service'

export type ContentPublishEnv = ContentEnv

const contentApp = new Hono<{ Bindings: ContentPublishEnv }>()

contentApp.route('/', getContentRoute)
contentApp.route('/', publishContentRoute)

export {
  contentApp,
  getContentRoute,
  publishContentRoute,
  type PublishContentRequest,
}
