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