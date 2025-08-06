import { useState, useRef, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import logo from '../assets/ECSlogo.png'
import { verifyEmail } from "../api/AuthApi"
import { setAccessToken, setRefreshToken } from "../utils/token"

export default function VerifyEmailPage() {
  const [codes, setCodes] = useState(["", "", "", "", "", ""])
  const [resendLoading, setResendLoading] = useState(false)
  const inputsRef = useRef<Array<HTMLInputElement | null>>([])
  const location = useLocation()
  const navigate = useNavigate()
  const email = location.state?.email

  useEffect(() => {
    if (!email) {
      navigate("/register")
    }
  }, [email, navigate])

  const handleChange = (value: string, idx: number) => {
    if (!/^\d*$/.test(value)) return
    const newCodes = [...codes]
    newCodes[idx] = value.slice(-1)
    setCodes(newCodes)
    if (value && idx < 5) {
      inputsRef.current[idx + 1]?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const code = codes.join("")
    if (code.length === 6) {
      try {
        const res = await verifyEmail(code, email)
        const { access_token, refresh_token } = res.data
        setAccessToken(access_token)
        setRefreshToken(refresh_token)
      } catch (err: any) {
        alert(err?.response?.data?.message || "Xác thực thất bại")
      }
    }
  }

  const handleResend = async () => {
    setResendLoading(true)
    // TODO: Gọi API gửi lại mã xác thực
    setTimeout(() => {
      alert("Mã xác thực đã được gửi lại!")
      setResendLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow w-full max-w-md text-center">
        <img
          src={logo}
          alt="Logo"
          className="mx-auto mb-4 w-18 h-18"
        />
        <h2 className="text-2xl font-bold mb-4">Xác thực email</h2>
        <p className="mb-6 text-gray-600">Nhập mã gồm 6 chữ số đã gửi đến email của bạn</p>
        <div className="flex justify-center gap-2 mb-6">
          {codes.map((code, idx) => (
            <input
              key={idx}
              ref={el => { inputsRef.current[idx] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className="w-12 h-12 text-2xl text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={code}
              onChange={e => handleChange(e.target.value, idx)}
            />
          ))}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
        >
          Xác thực
        </button>
        <div className="mt-6 text-gray-600 text-sm">
          Bạn chưa nhận được mã?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={resendLoading}
            className="text-blue-500 hover:underline font-medium"
          >
            {resendLoading ? "Đang gửi..." : "Gửi lại mã"}
          </button>
        </div>
      </form>
    </div>
  )
}