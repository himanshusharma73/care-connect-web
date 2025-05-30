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

export interface AuthenticationResponse {
  accessToken: string
  refreshToken: string
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
