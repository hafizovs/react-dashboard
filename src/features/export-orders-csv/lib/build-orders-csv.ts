import type { Order } from '@/entities/order'

export type CsvColumn<T> = {
  id: keyof T & string
  header: string
  format?: (value: T[keyof T], row: T) => string
}

function escapeCsvCell(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export function buildOrdersCsv(
  rows: Order[],
  columns: CsvColumn<Order>[],
): string {
  const headerLine = columns.map((column) => escapeCsvCell(column.header)).join(',')
  const bodyLines = rows.map((row) =>
    columns
      .map((column) => {
        const raw = row[column.id]
        const formatted = column.format
          ? column.format(raw, row)
          : String(raw ?? '')
        return escapeCsvCell(formatted)
      })
      .join(','),
  )
  return [headerLine, ...bodyLines].join('\n')
}

export function downloadCsv(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
