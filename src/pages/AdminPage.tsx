// src/pages/AdminPage.tsx
import { useState } from "react"
import AdminLogin from "../components/admin/AdminLogin"
import AdminDashboard from "../components/admin/AdminDashboard"
import { isAdminSignedIn, signOutAdmin } from "../lib/adminAuth"

export default function AdminPage() {
  const [signedIn, setSignedIn] = useState(isAdminSignedIn)

  if (!signedIn) {
    return <AdminLogin onAuthenticated={() => setSignedIn(true)} />
  }

  return (
    <AdminDashboard
      onSignOut={() => {
        signOutAdmin()
        setSignedIn(false)
      }}
    />
  )
}