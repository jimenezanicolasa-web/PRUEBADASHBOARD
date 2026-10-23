'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  className,
}: {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === ref.current) onClose()
      }}
      aria-labelledby="modal-title"
      className={cn(
        'm-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-xl border border-border bg-popover p-0 text-popover-foreground shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-sm',
        className,
      )}
    >
      {open && (
        <div className="flex flex-col gap-5 p-5 sm:p-6">
          <header className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h2 id="modal-title" className="text-lg font-semibold text-balance">
                {title}
              </h2>
              {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-5" aria-hidden="true" />
              <span className="sr-only">Cerrar</span>
            </button>
          </header>
          {children}
        </div>
      )}
    </dialog>
  )
}
