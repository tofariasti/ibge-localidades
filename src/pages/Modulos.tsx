import { Link } from 'react-router-dom'
import { useModules } from '../hooks/useModules'
import {
  MODULE_CATALOG,
  MODULE_PLAN_LABEL,
  type ModuleId,
} from '../lib/modules'

export function Modulos() {
  const { isEnabled, setOptionalEnabled } = useModules()

  return (
    <section className="page modulos">
      <h1>Módulos</h1>
      <p>
        Catálogo de capacidades do IBGE Localidades. O plano{' '}
        <strong>Livre</strong> cobre a hierarquia e indicadores do Censo 2022.
        Módulos do plano <strong>Análise</strong> são opcionais (sem cobrança
        nesta demo — ative ou desative aqui). Use{' '}
        <code>?modulos=series,nomes</code> na URL para compartilhar uma view com
        módulos ligados.
      </p>

      <ul className="modulos__list">
        {MODULE_CATALOG.map((mod) => {
          const on = isEnabled(mod.id)
          return (
            <li key={mod.id} className="modulos__card">
              <div className="modulos__card-head">
                <h2>{mod.label}</h2>
                <span
                  className={
                    mod.plan === 'livre'
                      ? 'modulos__badge modulos__badge--livre'
                      : 'modulos__badge modulos__badge--analise'
                  }
                >
                  {MODULE_PLAN_LABEL[mod.plan]}
                </span>
              </div>
              <p>{mod.description}</p>
              <div className="modulos__card-actions">
                {mod.lockedOn ? (
                  <p className="modulos__status" role="status">
                    Sempre ativo
                  </p>
                ) : (
                  <label className="modulos__toggle">
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={(e) =>
                        setOptionalEnabled(mod.id as ModuleId, e.target.checked)
                      }
                    />
                    {on ? 'Ativo' : 'Inativo'}
                  </label>
                )}
                {mod.href && on ? (
                  <Link to={mod.href} className="button button--secondary">
                    Abrir
                  </Link>
                ) : null}
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
