import {
  RANKING_INDICATORS,
  type RankingIndicatorKey,
} from '../lib/rankingIndicators'

type RankingIndicatorToggleProps = {
  value: RankingIndicatorKey
  onChange: (key: RankingIndicatorKey) => void
}

export function RankingIndicatorToggle({
  value,
  onChange,
}: RankingIndicatorToggleProps) {
  return (
    <div
      className="map-mode-toggle ranking__indicator-toggle"
      role="group"
      aria-label="Indicador do ranking"
    >
      {RANKING_INDICATORS.map((item) => (
        <button
          key={item.key}
          type="button"
          className={
            value === item.key
              ? 'map-mode-toggle__btn is-active'
              : 'map-mode-toggle__btn'
          }
          aria-pressed={value === item.key}
          onClick={() => onChange(item.key)}
        >
          {item.shortLabel}
        </button>
      ))}
    </div>
  )
}
