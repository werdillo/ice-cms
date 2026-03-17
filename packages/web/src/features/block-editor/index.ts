// Public API for the block-editor feature.
// Only intentionally public symbols are exported from here.
// Internal components (DraggableBlock, FieldRenderer, field inputs, etc.)
// are NOT re-exported.

// --- Primary export: the top-level list component ---
export { default as SortableBlockList } from './components/SortableBlockList'
export { default } from './components/SortableBlockList'

// --- Types ---
export type { BlockState } from './types'

// --- Advanced / composable exports for consumers who need individual pieces ---
export { default as BlockCard } from './components/BlockCard'
export { default as BlockModal } from './components/BlockModal'
