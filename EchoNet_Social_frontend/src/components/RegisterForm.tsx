import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import logo from '../assets/ECSlogo.png'
import { register } from "../api/AuthApi"
import type { RegisterDTO } from "../types/AuthType"

export default function RegisterForm() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert("Mật khẩu nhập lại không khớp!")
      return
    }
    const data: RegisterDTO = { email, password, confirmPassword, fullname: fullName }
    try {
      const res = await register(data)
      if (res.status === 201) {
        navigate("/verifyemail", { state: { email } })
      } else {
        alert("Đăng ký thất bại: " + res.data.message)
      }
    } catch (err: any) {
      alert("Đăng ký thất bại: " + (err?.response?.data?.message || "Lỗi hệ thống"))
    }
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8">
      <div className="mb-6 text-center">
        <img
          src={logo}
          alt="Logo"
          className="mx-auto w-18 h-18"
        />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Đăng ký tài khoản</h2>
        <p className="text-gray-500 text-sm">Tạo tài khoản mới để bắt đầu!</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1 font-medium">Họ và tên</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Nhập họ và tên"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1 font-medium">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Nhập email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1 font-medium">Mật khẩu</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? "Ẩn" : "Hiện"}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-gray-700 mb-1 font-medium">Xác nhận mật khẩu</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              tabIndex={-1}
            >
              {showConfirmPassword ? "Ẩn" : "Hiện"}
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
        >
          Đăng ký
        </button>
      </form>
      <div className="mt-6 text-center text-gray-600 text-sm">
        Đã có tài khoản?{" "}
        <Link to="/login" className="text-blue-500 hover:underline font-medium">
          Đăng nhập
        </Link>
      </div>
    </div>
  )
}