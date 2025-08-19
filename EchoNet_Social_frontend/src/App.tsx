import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { lazy } from "react"
import MainApp from "./MainApp"

const LoginPage = lazy(() => import("./pages/LoginPage"))
const RegisterPage = lazy(() => import("./pages/RegisterPage"))
const VerifyEmailPage = lazy(() => import("./pages/VerifyEmailPage"))
const GoogleRedirectPage = lazy(() => import("./pages/GoogleRedirectPage"))
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"))
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"))

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/*" element={<MainApp />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verifyemail" element={<VerifyEmailPage />} />
          <Route path="/google-redirect" element={<GoogleRedirectPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Routes>
    </Router>
  )
}

export default App
