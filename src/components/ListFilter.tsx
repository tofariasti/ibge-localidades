type ListFilterProps = {
  id: string
  value: string
  onChange: (value: string) => void
  shown: number
  total: number
  placeholder?: string
  label?: string
}

export function ListFilter({
  id,
  value,
  onChange,
  shown,
  total,
  placeholder = 'Filtrar por nome ou código…',
  label = 'Filtrar',
}: ListFilterProps) {
  return (
    <div className="list-filter">
      <label htmlFor={id} className="list-filter__label">
        {label}
      </label>
      <input
        id={id}
        className="list-filter__input"
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
      />
      <p className="list-filter__count" aria-live="polite">
        {value.trim()
          ? `${shown} de ${total} resultado${total === 1 ? '' : 's'}`
          : `${total} item${total === 1 ? '' : 's'}`}
      </p>
    </div>
  )
}
