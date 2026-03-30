import { type Component, createSignal, Show } from 'solid-js'
import { apiFetch } from '../../../lib/api-fetch'

const API_BASE = `${import.meta.env.VITE_API_URL ?? 'http://localhost:8000'}/api`

function extractKeyFromUrl(url: string): string | null {
  // Matches both proxy URLs (/api/storage/uploads/...) and public R2 URLs (pub-*.r2.dev/uploads/...)
  const match = url.match(/\/?(uploads\/[^?#]+)/)
  return match ? match[1] : null
}

export type ImageValue = {
  src: string
  alt: string
}

type ImageUploadProps = {
  value: ImageValue
  onChange: (value: ImageValue) => void
  label?: string
}

export const ImageUpload: Component<ImageUploadProps> = (props) => {
  const [uploading, setUploading] = createSignal(false)
  const [error, setError] = createSignal('')

  let fileInputRef!: HTMLInputElement

  const handleFileChange = async (e: Event) => {
    const input = e.currentTarget as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return

    setError('')
    setUploading(true)

    try {
      const form = new FormData()
      form.append('file', file)

      const oldKey = props.value.src ? extractKeyFromUrl(props.value.src) : null
      if (oldKey) form.append('oldKey', oldKey)

      const res = await apiFetch(`${API_BASE}/storage/upload`, {
        method: 'POST',
        body: form,
      })

      let data: { success: boolean; url?: string; error?: string }
      try {
        data = await res.json()
      } catch {
        setError(`Server error ${res.status}: could not parse response`)
        return
      }

      console.log('[upload] status:', res.status, 'body:', data)

      if (!res.ok || !data.success || !data.url) {
        setError(`[${res.status}] ${data.error ?? 'Upload failed'}`)
        return
      }

      props.onChange({ ...props.value, src: data.url })
    } catch (err) {
      console.error('[upload] fetch error:', err)
      setError(`Could not connect to the server: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setUploading(false)
      // Reset input so same file can be re-selected
      input.value = ''
    }
  }

  return (
    <div class="flex flex-col gap-2">
      <Show when={props.label}>
        <span class="text-sm font-medium opacity-70">{props.label}</span>
      </Show>

      {/* Preview + upload button row */}
      <div class="flex items-start gap-3">
        {/* Thumbnail */}
        <div
          class="w-20 h-20 rounded-box border border-base-content/10 bg-base-200 flex items-center justify-center shrink-0 overflow-hidden cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => fileInputRef.click()}
          title="Click to upload image"
        >
          <Show
            when={props.value.src}
            fallback={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="opacity-20">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                <circle cx="9" cy="9" r="2"/>
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
              </svg>
            }
          >
            <img
              src={props.value.src}
              alt={props.value.alt}
              class="w-full h-full object-cover"
            />
          </Show>
        </div>

        {/* Controls */}
        <div class="flex flex-col gap-2 flex-1 min-w-0">
          <button
            type="button"
            class="btn btn-sm btn-outline w-fit"
            disabled={uploading()}
            onClick={() => fileInputRef.click()}
          >
            {uploading()
              ? <><span class="loading loading-spinner loading-xs" /> Uploading…</>
              : props.value.src ? 'Change image' : 'Upload image'
            }
          </button>

          {/* Alt text */}
          <input
            type="text"
            class="input input-sm input-bordered w-full"
            placeholder="Alt text"
            value={props.value.alt}
            onInput={(e) => props.onChange({ ...props.value, alt: e.currentTarget.value })}
          />

          {/* URL fallback (manual input) */}
          <input
            type="text"
            class="input input-xs input-ghost w-full font-mono opacity-40 hover:opacity-70 focus:opacity-100 focus:input-bordered"
            placeholder="or paste URL…"
            value={props.value.src}
            onInput={(e) => props.onChange({ ...props.value, src: e.currentTarget.value })}
          />

          <Show when={error()}>
            <p class="text-xs text-error">{error()}</p>
          </Show>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        class="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}

export default ImageUpload
