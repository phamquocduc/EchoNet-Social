import { useState, useRef, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import logo from '../assets/ECSlogo.png'
import { resendVerificationEmail, verifyEmail } from "../api/AuthApi"
import { setAccessToken, setRefreshToken } from "../utils/token"

export default function VerifyEmailPage() {
  const [codes, setCodes] = useState(["", "", "", "", "", ""])
  const [resendLoading, setResendLoading] = useState(false)
  const [expire, setExpire] = useState(120) // 2 phút
  const [resendWait, setResendWait] = useState(0)
  const inputsRef = useRef<Array<HTMLInputElement | null>>([])
  const location = useLocation()
  const navigate = useNavigate()
  const email = location.state?.email

  useEffect(() => {
    if (!email) {
      navigate("/register")
    }
  }, [email, navigate])

  // Đếm ngược thời gian hết hạn mã
  useEffect(() => {
    if (expire <= 0) return
    const timer = setInterval(() => setExpire(e => e - 1), 1000)
    return () => clearInterval(timer)
  }, [expire])

  // Đếm ngược thời gian chờ gửi lại mã
  useEffect(() => {
    if (resendWait <= 0) return
    const timer = setInterval(() => setResendWait(w => w - 1), 1000)
    return () => clearInterval(timer)
  }, [resendWait])

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
        const { access_token, refresh_token } = res.data?.data
        setAccessToken(access_token)
        setRefreshToken(refresh_token)
        // TODO: chuyển trang sau khi xác thực thành công
      } catch (err: any) {
        alert(err?.response?.data?.message || "Xác thực thất bại")
      }
    }
  }

  const handleResend = async () => {
    setResendLoading(true)
    setTimeout(() => {
        setResendLoading(false)
        setExpire(120) 
        setResendWait(20) 
    }, 1000)
    await resendVerificationEmail(email)
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, "0")}`
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
        <p className="mb-2 text-gray-600">
          Nhập mã gồm 6 chữ số đã gửi đến email của bạn
        </p>
        <div className="mb-4 text-sm text-gray-500">
          Mã hết hạn sau: <span className="font-semibold text-blue-600">{formatTime(expire)}</span>
        </div>
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
          disabled={expire <= 0}
        >
          Xác thực
        </button>
        <div className="mt-6 text-gray-600 text-sm">
          Bạn chưa nhận được mã?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={resendLoading || resendWait > 0}
            className="text-blue-500 hover:underline font-medium"
          >
            {resendLoading
              ? "Đang gửi..."
              : resendWait > 0
                ? `Gửi lại mã (${resendWait}s)`
                : "Gửi lại mã"}
          </button>
        </div>
      </form>
    </div>
  )
}