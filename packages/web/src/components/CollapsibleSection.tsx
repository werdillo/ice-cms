import { type Component, type JSX } from 'solid-js'

type CollapsibleSectionProps = {
  title: string
  children: JSX.Element
  defaultOpen?: boolean
  titleClass?: string
  contentClass?: string
  class?: string
}

export const CollapsibleSection: Component<CollapsibleSectionProps> = (props) => {
  return (
    <div
      class={`collapse collapse-arrow border border-base-content/10 rounded-box ${props.class ?? ''}`}
    >
      <input type="checkbox" checked={props.defaultOpen ?? false} />
      <div
        class={`collapse-title text-xs font-semibold uppercase tracking-widest opacity-40 ${props.titleClass ?? ''}`}
      >
        {props.title}
      </div>
      <div class={`collapse-content ${props.contentClass ?? ''}`}>
        {props.children}
      </div>
    </div>
  )
}

export default CollapsibleSection
