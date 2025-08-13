export type RegisterDTO = {
    email: string
    password: string
    confirmPassword: string
    fullname: string
}

export type ResetPasswordDto = {
    token: string,
    newPassword: string,
    confirmNewPassword: string
}