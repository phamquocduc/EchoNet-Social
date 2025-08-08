export function setAccessToken(token: string) {
    localStorage.setItem("access_token", token)
}

export function setRefreshToken(token: string) {
    document.cookie = `refresh_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`
}