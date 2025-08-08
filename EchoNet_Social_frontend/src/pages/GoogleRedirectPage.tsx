import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { setAccessToken, setRefreshToken } from "../utils/token"
import { googleRedirect } from "../api/AuthApi"
import logo from "../assets/ECSlogo.png"

export default function GoogleRedirectPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const search: string = window.location.search
        const res = await googleRedirect(search)
        const { access_token, refresh_token } = res.data?.data
        setAccessToken(access_token)
        setRefreshToken(refresh_token)
        navigate("/")
      } catch (err: any) {
        navigate("/login")
      }
    }
    fetchToken()
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center max-w-md w-full">
        <img
          src={logo}
          alt="Logo"
          className="mb-6 w-16 h-16 bg-white rounded-full p-2 shadow"
        />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Đang xác thực Google...</h2>
        <p className="text-gray-500 text-center">
          Vui lòng chờ trong giây lát, hệ thống đang xác thực tài khoản Google của bạn.
        </p>
        <div className="mt-6 flex justify-center">
          <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
        </div>
      </div>
    </div>
  )
}