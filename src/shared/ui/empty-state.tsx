type EmptyStateProps = {
  title: string
  description: string
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[var(--border)] bg-[var(--bg)] px-6 py-12 text-center">
      <p className="text-sm font-medium text-[var(--text-h)]">{title}</p>
      <p className="max-w-sm text-sm text-[var(--muted-foreground)]">
        {description}
      </p>
    </div>
  )
}
