import { NextFunction, Request, Response } from 'express'
import {
  ForgotPasswordReqBody,
  LoginReqBody,
  LogoutReqBody,
  RegisterReqBody,
  TokenPayload,
  VerifyEmailReqQuery
} from '~/models/requests/users.requests'
import User from '~/models/schemas/User.schema'
import databaseServices from '~/services/database.services'
import usersServices from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import { body } from 'express-validator'
import { USERS_MESSAGES } from '~/constants/messages'
import { UserVerifyStatus } from '~/constants/enums'

// controller la handler co nhiem vu xu ly logic
// cac thoong tin khi da vao controller thi phai clear
// export const loginController = (req: Request, res: Response) => {
//   // vao day laf ktra du lieu, chi con dung thoi
//   //  du lieu nam trong body
//   const { email, password } = req.body
//   //vao database ktra xem dr hay ko?
//   //  xa lo
//   if (email === 'phucan0147@gmail.com' && password === 'weArePiedTeam') {
//     res.status(200).json({
//       message: 'login  success',
//       data: {
//         fname: 'Diep',
//         age: 1999
//       }
//     })
//   } else {
//     res.status(400).json({
//       message: 'invalid email or password'
//     })
//   }
// }

//registerController nhan vao thong tin dang ky cua nguoi dung
// va vao database de tao user moi luu vao
export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body

  //vao database vaf nhet vao collection

  // throw new Error('Loi rot manggg')

  // kiểm tra email có tồn tại hay chưa | có ai dùng email này chưa | email có bị trùng k
  const isDup = await usersServices.checkEmailExist(email)
  if (isDup) {
    throw new ErrorWithStatus({
      status: HTTP_STATUS.UNPROCESSABLE_ENTITY, //422
      message: USERS_MESSAGES.EMAIL_ALREADY_EXISTS
    })
  }

  const result = await usersServices.register(req.body)
  res.status(201).json({
    message: USERS_MESSAGES.REGISTER_SUCCESS,
    data: result
  })
}

export const loginController = async (
  req: Request<ParamsDictionary, any, LoginReqBody>,
  res: Response,
  next: NextFunction
) => {
  //throw new Error('Ahihi')
  //dùng email và password để tìm user đang sở hữu chúng
  //nếu có user đó tồn tại nghĩa là đnăg nhập thành công
  const { email, password } = req.body
  //vào database để tìm
  const result = await usersServices.login({ email, password })
  //
  res.status(HTTP_STATUS.OK).json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    result //ac và rf token
  })
}

export const logoutController = async (
  req: Request<ParamsDictionary, any, LogoutReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { refresh_token } = req.body
  //so user_id trong payload của ac và rf có phải là 1 không
  const { user_id: user_id_ac } = req.decode_authorization as TokenPayload
  const { user_id: user_id_rf } = req.decode_refresh_token as TokenPayload
  if (user_id_ac != user_id_rf) {
    throw new ErrorWithStatus({
      status: HTTP_STATUS.UNAUTHORIZED, //401
      message: USERS_MESSAGES.REFRESH_TOKEN_IS_INVALID
      //status: HTTP_STATUS.UNPROCESSABLE_ENTITY để troll tk hack
      //message: USERS_MESSAGES.REFRESH_TOKEN_IS_REQUIRED
    })
  }
  //nếu khớp mã thì ktr xem rf có trong database hay ko
  await usersServices.checkRefreshToken({
    user_id: user_id_rf,
    refresh_token
  })
  //phải có thì mới cung cấp dịch vụ: logout-xóa rf token
  await usersServices.logout(refresh_token)
  res.status(HTTP_STATUS.OK).json({
    message: USERS_MESSAGES.LOGOUT_SUCCESS
  })
}

export const verifyEmailController = async (
  req: Request<ParamsDictionary, any, any, VerifyEmailReqQuery>,
  res: Response,
  next: NextFunction
) => {
  //vào tời controller thì nghĩa là email_verify_token đã xác thực
  const { email_verify_token } = req.query
  const { user_id } = req.decode_email_verify_token as TokenPayload
  //kiểm tra xem user_id và email_verify_token có tồn tại trong database hay không
  const user = await usersServices.checkEmailVerifyToken({ user_id, email_verify_token })
  //kiểm tra xem người dùng có phải là unverify không?
  if (user.verify == UserVerifyStatus.Verified) {
    res.status(HTTP_STATUS.OK).json({
      message: USERS_MESSAGES.EMAIL_HAS_BEEN_VERIFIED
    })
  } else if (user.verify == UserVerifyStatus.Banned) {
    res.status(HTTP_STATUS.OK).json({
      message: USERS_MESSAGES.EMAIL_HAS_BEEN_BANNED
    })
  } else {
    const result = await usersServices.verifyEmail(user_id)
    res.status(HTTP_STATUS.OK).json({
      mesage: USERS_MESSAGES.VERIFY_EMAIL_SUCCESS,
      result //ac và ref dể người ta đăng nhập luôn
    })
  }
  //tiến hành verifyEmail
}

export const resendEmailVerifyController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  //lấy user_id tìm xem user này còn tồn tại hay không ?
  const { user_id } = req.decode_authorization as TokenPayload
  //từ user đó xem thử nó đã verify bị ban hay chưa verify
  const user = await usersServices.findUserById(user_id)
  //chưa verify thì mới resendEmailVerify
  if (user.verify == UserVerifyStatus.Verified) {
    res.status(HTTP_STATUS.OK).json({
      message: USERS_MESSAGES.EMAIL_HAS_BEEN_VERIFIED
    })
  } else if (user.verify == UserVerifyStatus.Banned) {
    res.status(HTTP_STATUS.OK).json({
      message: USERS_MESSAGES.EMAIL_HAS_BEEN_BANNED
    })
  } else {
    await usersServices.resendEmailVerify(user_id)
    res.status(HTTP_STATUS.OK).json({
      mesage: USERS_MESSAGES.RESEND_EMAIL_VERIFY_TOKEN_SUCCESS
    })
  }
}

export const forgotPasswordController = async (
  req: Request<ParamsDictionary, any, ForgotPasswordReqBody>,
  res: Response,
  next: NextFunction
) => {
  //người dùng cung ccap61 email cho mình
  const { email } = req.body
  //kiểm tra email có tồn tại trong database hay không
  const hasEmail = await usersServices.checkEmailExist(email)
  if (!hasEmail) {
    //nghĩa là email sai hoặc đã bị xóa
    throw new ErrorWithStatus({
      status: HTTP_STATUS.NOT_FOUND,
      message: USERS_MESSAGES.USER_NOT_FOUND
    })
  } else {
    //có thì mình tạo token và mình gửi
    await usersServices.forgotPassword(email)
    res.status(HTTP_STATUS.OK).json({
      message: USERS_MESSAGES.CHECK_EMAIL_TO_RESET_PASSWORD
    })
  }
}
