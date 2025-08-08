import axios from "axios"
import type { RegisterDTO } from "../types/AuthType"

const API_URL = import.meta.env.VITE_API_URL

export async function login(email: string, password: string) {
    return axios.post(`${API_URL}/identity/auth/login`, { email, password })
}

export async function register(data: RegisterDTO) {
    return axios.post(`${API_URL}/identity/auth/register`, data)
}

export async function verifyEmail(code: string, email: string) {
    return axios.post(`${API_URL}/identity/auth/verify-email`, { code, email })
}

export async function googleLogin() {
    window.location.href = `${API_URL}/identity/auth/google`
}

export async function googleRedirect(search: string) {
    return axios.get(`${API_URL}/identity/auth/google/redirect${search}`)
}

export async function resendVerificationEmail(email: string) {
    return axios.post(`${API_URL}/identity/auth/resend-verify-email`, { email })
}