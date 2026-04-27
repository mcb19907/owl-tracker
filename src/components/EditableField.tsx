import { useEffect, useRef, useState, type CSSProperties } from 'react'

type Props = {
  value: string
  placeholder: string
  onChange: (next: string) => void
  style: CSSProperties
  hintColor?: string
}

export function EditableField({ value, placeholder, onChange, style, hintColor }: Props) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    setDraft(value)
  }, [value])

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editing])

  const commit = () => {
    setEditing(false)
    if (draft !== value) onChange(draft.trim())
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit()
          if (e.key === 'Escape') {
            setDraft(value)
            setEditing(false)
          }
        }}
        style={{
          ...style,
          background: 'rgba(255,255,255,0.06)',
          border: 'none',
          borderBottom: `1.5px solid ${hintColor || '#888'}`,
          outline: 'none',
          padding: '1px 4px',
          margin: '-1px -4px',
          color: 'inherit',
          width: 'calc(100% + 8px)',
          boxSizing: 'border-box',
        }}
      />
    )
  }

  const isPlaceholder = !value
  return (
    <span
      onClick={() => setEditing(true)}
      style={{
        ...style,
        cursor: 'text',
        borderBottom: isPlaceholder
          ? `1px dashed ${hintColor || 'currentColor'}80`
          : 'none',
        display: 'inline-block',
        paddingBottom: isPlaceholder ? 1 : 0,
      }}
    >
      {value || placeholder}
    </span>
  )
}
