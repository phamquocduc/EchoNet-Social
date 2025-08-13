import { useState } from "react"
import logo from '../assets/ECSlogo.png'
import googleLogo from '../assets/googleLogo.svg'
import { Link, useNavigate } from "react-router-dom"
import { googleLogin, login } from "../api/AuthApi"
import { setAccessToken, setRefreshToken } from "../utils/token"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await login(email, password)
      const { access_token, refresh_token } = res.data?.data
      setAccessToken(access_token)
      setRefreshToken(refresh_token)
      console.log("Đăng nhập thành công!")
      navigate("/")
    } catch (err: any) {
      setError(err?.response?.data?.message || "Đăng nhập thất bại")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    googleLogin()
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8">
      <div className="mb-6 text-center">
        <img
          src={logo}
          alt="Logo"
          className="mx-auto w-16 h-16"
        />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Đăng nhập tài khoản</h2>
        <p className="text-gray-500 text-sm">Chào mừng bạn quay trở lại!</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="mb-2 text-red-500 text-sm text-center">
            {error}
          </div>
        )}
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
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <input type="checkbox" id="remember" className="mr-2" />
            <label htmlFor="remember" className="text-gray-600 text-sm">Ghi nhớ đăng nhập</label>
          </div>
          <Link to="/forgot-password" className="text-blue-500 text-sm hover:underline">Quên mật khẩu?</Link>
        </div>
        <button
          type="submit"
          className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
          disabled={loading}
        >
          {loading ? "Đang xử lý..." : "Đăng nhập"}
        </button>
      </form>
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="flex cursor-pointer items-center justify-center w-full mt-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
      >
        <img src={googleLogo} alt="Google" className="w-5 h-5 mr-2 rounded" />
        <span className="text-gray-700 font-medium">Đăng nhập với Google</span>
      </button>
      <div className="mt-6 text-center text-gray-600 text-sm">
        Chưa có tài khoản?{" "}
        <Link to="/register" className="text-blue-500 hover:underline font-medium">
          Đăng ký
        </Link>
      </div>
    </div>
  )
}