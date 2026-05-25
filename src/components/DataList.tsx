import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export interface DataListColumn<T> {
  header: string
  render: (item: T) => ReactNode
}

interface DataListProps<T> {
  items: T[]
  columns: DataListColumn<T>[]
  getRowKey: (item: T) => string | number
  getRowLink?: (item: T) => string
}

export function DataList<T>({
  items,
  columns,
  getRowKey,
  getRowLink,
}: DataListProps<T>) {
  return (
    <table className="data-list">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.header}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={getRowKey(item)}>
            {columns.map((col, colIndex) => (
              <td key={col.header}>
                {colIndex === 0 && getRowLink ? (
                  <Link to={getRowLink(item)}>{col.render(item)}</Link>
                ) : (
                  col.render(item)
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
