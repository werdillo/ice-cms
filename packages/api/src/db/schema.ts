import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

// --- Pages ---
export const pages = sqliteTable('pages', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(datetime('now'))`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`(datetime('now'))`),
})

// --- Meta (SEO) ---
export const pageMeta = sqliteTable('page_meta', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  pageId: text('page_id')
    .notNull()
    .references(() => pages.id, { onDelete: 'cascade' }),
  lang: text('lang', { enum: ['en', 'lv', 'ru'] }).notNull(),
  title: text('title').notNull().default(''),
  description: text('description').notNull().default(''),
  keywords: text('keywords').notNull().default(''),
  ogTitle: text('og_title').notNull().default(''),
  ogDescription: text('og_description').notNull().default(''),
  ogImage: text('og_image').notNull().default(''),
  canonicalUrl: text('canonical_url').notNull().default(''),
})

// --- Layout (header/footer/sidebar config) ---
export const pageLayout = sqliteTable('page_layout', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  pageId: text('page_id')
    .notNull()
    .references(() => pages.id, { onDelete: 'cascade' }),
  lang: text('lang', { enum: ['en', 'lv', 'ru'] }).notNull(),
  // Stored as JSON strings
  header: text('header').notNull().default('{}'),
  footer: text('footer').notNull().default('{}'),
  sidebar: text('sidebar').notNull().default('{}'),
})

// --- Blocks ---
export const blocks = sqliteTable('blocks', {
  id: text('id').primaryKey(),            // e.g. "__solution-section"
  pageId: text('page_id')
    .notNull()
    .references(() => pages.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),            // e.g. "solution-section"
  order: integer('order').notNull().default(0),
  enabled: integer('enabled', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(datetime('now'))`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`(datetime('now'))`),
})

// --- Block translations (one row per block per language) ---
export const blockTranslations = sqliteTable('block_translations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  blockId: text('block_id')
    .notNull()
    .references(() => blocks.id, { onDelete: 'cascade' }),
  lang: text('lang', { enum: ['en', 'lv', 'ru'] }).notNull(),
  // All block field values stored as JSON
  data: text('data').notNull().default('{}'),
})

// --- Types ---
export type Page = typeof pages.$inferSelect
export type NewPage = typeof pages.$inferInsert

export type PageMeta = typeof pageMeta.$inferSelect
export type NewPageMeta = typeof pageMeta.$inferInsert

export type PageLayout = typeof pageLayout.$inferSelect
export type NewPageLayout = typeof pageLayout.$inferInsert

export type Block = typeof blocks.$inferSelect
export type NewBlock = typeof blocks.$inferInsert

export type BlockTranslation = typeof blockTranslations.$inferSelect
export type NewBlockTranslation = typeof blockTranslations.$inferInsert
