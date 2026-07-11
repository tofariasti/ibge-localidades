import { Route, Routes } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { Home } from '../pages/Home'
import { RegioesList } from '../pages/RegioesList'
import { RegiaoDetail } from '../pages/RegiaoDetail'
import { EstadosList } from '../pages/EstadosList'
import { EstadoDetail } from '../pages/EstadoDetail'
import { MunicipiosList } from '../pages/MunicipiosList'
import { MunicipioDetail } from '../pages/MunicipioDetail'
import { MesorregioesList } from '../pages/MesorregioesList'
import { MesorregiaoDetail } from '../pages/MesorregiaoDetail'
import { MicrorregioesList } from '../pages/MicrorregioesList'
import { MicrorregiaoDetail } from '../pages/MicrorregiaoDetail'
import { RegioesIntermediariasList } from '../pages/RegioesIntermediariasList'
import { RegiaoIntermediariaDetail } from '../pages/RegiaoIntermediariaDetail'
import { RegioesImediatasList } from '../pages/RegioesImediatasList'
import { RegiaoImediataDetail } from '../pages/RegiaoImediataDetail'
import { PaisesList } from '../pages/PaisesList'
import { PaisDetail } from '../pages/PaisDetail'
import { Comparar } from '../pages/Comparar'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="regioes" element={<RegioesList />} />
        <Route path="regioes/:id" element={<RegiaoDetail />} />
        <Route path="estados" element={<EstadosList />} />
        <Route path="estados/:id" element={<EstadoDetail />} />
        <Route path="estados/:id/municipios" element={<MunicipiosList />} />
        <Route
          path="estados/:id/mesorregioes"
          element={<MesorregioesList />}
        />
        <Route
          path="estados/:id/microrregioes"
          element={<MicrorregioesList />}
        />
        <Route
          path="estados/:id/regioes-intermediarias"
          element={<RegioesIntermediariasList />}
        />
        <Route
          path="estados/:id/regioes-imediatas"
          element={<RegioesImediatasList />}
        />
        <Route path="mesorregioes/:id" element={<MesorregiaoDetail />} />
        <Route path="microrregioes/:id" element={<MicrorregiaoDetail />} />
        <Route
          path="regioes-intermediarias/:id"
          element={<RegiaoIntermediariaDetail />}
        />
        <Route path="regioes-imediatas/:id" element={<RegiaoImediataDetail />} />
        <Route path="paises" element={<PaisesList />} />
        <Route path="paises/:id" element={<PaisDetail />} />
        <Route path="municipios/:id" element={<MunicipioDetail />} />
        <Route path="comparar" element={<Comparar />} />
      </Route>
    </Routes>
  )
}
