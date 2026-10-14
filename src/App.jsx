import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { CadastroProduto } from './pages/Admin/CadastroProduto'
import Cadastro from './pages/Cadastro'
import Refazersenha from './pages/Cadastro/refazersenha'
import EsqueuseSenha from './pages/Esqueceusenha'
import Carrinho from './pages/Carrinho'
import Finalizacao from './pages/Finalizacao'
import Home from './pages/Home'
import Login from './pages/Login'
import PerfilAdmin from './pages/Admin/Perfil'
import PerfilCliente from './pages/Perfil'
import Relatorios from './pages/Relatorios'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Home" element={<ProtectedRoute tipo="cliente"><Home /></ProtectedRoute>} />
        <Route path="/inicio" element={<ProtectedRoute tipo="cliente"><Home /></ProtectedRoute>} />
        <Route path="/produtos" element={<ProtectedRoute tipo="cliente"><Home /></ProtectedRoute>} />
        <Route path="/carrinho" element={<ProtectedRoute tipo="cliente"><Carrinho /></ProtectedRoute>} />
        <Route path="/finalizacao" element={<ProtectedRoute tipo="cliente"><Finalizacao /></ProtectedRoute>} />
        <Route path="/produtos/novo" element={<ProtectedRoute tipo="admin"><CadastroProduto /></ProtectedRoute>} />
        <Route path="/perfil" element={<ProtectedRoute tipo="cliente"><PerfilCliente /></ProtectedRoute>} />
        <Route path="/admin/perfil" element={<ProtectedRoute tipo="admin"><PerfilAdmin /></ProtectedRoute>} />
        <Route path="/relatorios" element={<ProtectedRoute tipo="admin"><Relatorios /></ProtectedRoute>} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/esqueceu-senha" element={<EsqueuseSenha />} />
        <Route path="/refazer-senha" element={<Refazersenha />} />
        <Route path="/clientes" element={<ProtectedRoute tipo="admin"><Navigate to="/relatorios" replace /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App;
