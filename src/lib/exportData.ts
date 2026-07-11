export type CsvColumn<T> = {
  header: string
  value: (item: T) => string | number | boolean | null | undefined
}

function escapeCsvCell(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export function toCsv<T>(items: T[], columns: CsvColumn<T>[]): string {
  const header = columns.map((c) => escapeCsvCell(c.header)).join(',')
  const rows = items.map((item) =>
    columns
      .map((c) => {
        const raw = c.value(item)
        return escapeCsvCell(raw == null ? '' : String(raw))
      })
      .join(','),
  )
  return [header, ...rows].join('\n')
}

export function downloadTextFile(
  filename: string,
  content: string,
  mimeType: string,
): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

export function downloadCsv<T>(
  filename: string,
  items: T[],
  columns: CsvColumn<T>[],
): void {
  downloadTextFile(filename, toCsv(items, columns), 'text/csv;charset=utf-8')
}

export function downloadJson(filename: string, data: unknown): void {
  downloadTextFile(
    filename,
    JSON.stringify(data, null, 2),
    'application/json;charset=utf-8',
  )
}
