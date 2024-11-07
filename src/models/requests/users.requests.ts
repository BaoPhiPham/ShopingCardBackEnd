import { JwtPayload } from 'jsonwebtoken'
import { TokenType } from '~/constants/enums'
import { ParsedQs } from 'qs'

// file naỳ lưu các định nghĩa mà người dùng gửi lên
export interface RegisterReqBody {
  name: string
  email: string
  password: string
  confirm_password: string
  date_of_birth: string
}

export interface LoginReqBody {
  email: string
  password: string
}

export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenType
}

export interface LogoutReqBody {
  refresh_token: string
}

export interface VerifyEmailReqQuery extends ParsedQs {
  email_verify_token: string
}

export interface ForgotPasswordReqBody {
  email: string
}