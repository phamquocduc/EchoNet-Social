export function setAccessToken(token: string) {
    localStorage.setItem("accessToken", token)
}

export function setRefreshToken(token: string) {
    document.cookie = `refreshToken=${token}; path=/; max-age=${60 * 60 * 24 * 7}`
}