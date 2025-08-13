import { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import logo from "../assets/ECSlogo.png"
import type { ResetPasswordDto } from "../types/AuthType"
import { resetPasswordEmail } from "../api/AuthApi"

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      navigate("/login")
    }
  }, [token, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setMessage("")
    if (!token) {
      setError("Token không hợp lệ!")
      return
    }
    if (password !== confirmPassword) {
      setError("Mật khẩu nhập lại không khớp!")
      return
    }
    setLoading(true)
    try {
      const resetPasswordDto : ResetPasswordDto = { 
        token, 
        newPassword: password, 
        confirmNewPassword: confirmPassword 
      }
      await resetPasswordEmail(resetPasswordDto)
      setMessage("Đặt lại mật khẩu thành công!")
      setTimeout(() => navigate("/login"), 2000)
    } catch (err: any) {
      setError("Đặt lại mật khẩu thất bại")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow w-full max-w-md text-center">
        <img src={logo} alt="Logo" className="mx-auto mb-4 w-16 h-16" />
        <h2 className="text-2xl font-bold mb-4">Đặt lại mật khẩu</h2>
        <p className="mb-6 text-gray-600">Nhập mật khẩu mới cho tài khoản của bạn</p>
        {error && <div className="mb-2 text-red-500 text-sm">{error}</div>}
        {message && <div className="mb-2 text-green-500 text-sm">{message}</div>}
        <input
          type="password"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
          placeholder="Mật khẩu mới"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
          placeholder="Nhập lại mật khẩu mới"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
          disabled={loading}
        >
          {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
        </button>
      </form>
    </div>
  )
}