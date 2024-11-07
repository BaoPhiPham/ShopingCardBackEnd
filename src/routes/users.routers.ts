import express, { Request, Response } from 'express'
import {
  forgotPasswordController,
  loginController,
  logoutController,
  registerController,
  resendEmailVerifyController,
  verifyEmailController
} from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  verifyEmailTokenValidator
} from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handlers'
//đựng user Router
const userRouter = express.Router()

//setup middleware

// no co next la middleware
// cos next mới dc đi, ko có next thì dừng lại
//  dc dùng làm bộ lọc, dc thì di tiếp ko dc dừng lại

// /users/login
/*desc: login
path: users: login
method: post
body{
    email: string,
    password: string
}
*/
userRouter.post('/login', loginValidator, wrapAsync(loginController)) // cai nay goi la headler

/*
desc: Resgister a new user
path: /register
Method: post
Body: {
    name: string,
    email: string,
    password: string,
    confirm_password: string,
    date_of_birth: string có dạng ISO8601
}
*/
userRouter.post('/register', registerValidator, wrapAsync(registerController))

/*desc: logout
path: users/logout
method: post
headers:{
    Authorization: 'Bearer <access_token>'
}
body: {
    refresh_token: string
}
*/
userRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapAsync(logoutController))

/*desc: verify-email: khi người dùng vào email và bấm vào link dể verify email
họ sẽ gửi email_verify_token lên cho mình thông qua query
path: users/verify-email/?email_verify_token=string
method: get
*/
userRouter.get('/verify-email/', verifyEmailTokenValidator, wrapAsync(verifyEmailController))

/*desc: Resend Email Verify
path: users/resend-email-verify
chức năng này cần đăng nhập để sử dụng
headers:{
    Authorization: 'Bearer <access_token>'
}
*/
userRouter.post('/resend-email-verify', accessTokenValidator, wrapAsync(resendEmailVerifyController))

/*desc: forgot password(dùng khi quên mk hoặc bị ăn cấp mk)
khi mà ta bị quên mk thì ta sẽ ko đăng nhập được
thứ duy nhất mà ta có thể cung cấp cho sever là email
path:users/forgot-password
method: post
body:{
    email: string
}
*/
userRouter.post('/forgot-password', forgotPasswordValidator, wrapAsync(forgotPasswordController))

export default userRouter
