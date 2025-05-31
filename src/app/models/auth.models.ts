// Updated models to match backend response
export interface LoginRequest {
  email: string
  password: string
}

export interface UserRequest {
  email: string
  password: string
  roles: string[]
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface UserDto {
  id: string
  email: string
  roles: string[]
  name?: string
}


export interface RefreshTokenRequest {
  refreshToken: string
}
