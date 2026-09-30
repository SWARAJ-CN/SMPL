// src/App.tsx
import { Route, Routes } from "react-router-dom"
import Header from "./components/layout/Header"
import ScrollToTop from "./components/ScrollToTop"
import HomePage from "./pages/HomePage"
import RegisterPage from "./pages/RegisterPage"
import AdminPage from "./pages/AdminPage"
import NotFoundPage from "./pages/NotFoundPage"
import Footer from "./components/layout/Footer"


export default function App() {
  return (
    <div className="min-h-screen bg-[#f7f8f3] text-[#193626]">
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </div>
  )
}