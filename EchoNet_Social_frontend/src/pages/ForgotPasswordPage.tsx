import { useState } from "react"
import logo from "../assets/ECSlogo.png"
import { forgotPasswordEmail } from "../api/AuthApi"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setMessage("")
    try {
      await forgotPasswordEmail(email)
      setMessage("Mã xác thực đã được gửi đến email của bạn!")
    } catch (err: any) {
      setError("Gửi mã thất bại")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow w-full max-w-md text-center">
        <img src={logo} alt="Logo" className="mx-auto mb-4 w-16 h-16" />
        <h2 className="text-2xl font-bold mb-4">Quên mật khẩu</h2>
        <p className="mb-6 text-gray-600">Nhập email để nhận mã xác thực đặt lại mật khẩu</p>
        {error && <div className="mb-2 text-red-500 text-sm">{error}</div>}
        {message && <div className="mb-2 text-green-500 text-sm">{message}</div>}
        <input
          type="email"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
          placeholder="Nhập email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
          disabled={loading}
        >
          {loading ? "Đang gửi..." : "Gửi mã"}
        </button>
      </form>
    </div>
  )
}