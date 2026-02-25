import { useContext } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import Navbar from '../../components/admin/Navbar'
import Sidebar from '../../components/admin/Sidebar'
import Footer from '../../components/educator/Footer'

const Admin = () => {
  const { isAdmin } = useContext(AppContext)

  if (!isAdmin) return <Navigate to="/" replace />

  return (
    <div className="text-default min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default Admin
