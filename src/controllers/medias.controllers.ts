import { Request, Response, NextFunction } from 'express'
import HTTP_STATUS from '~/constants/httpStatus'
import mediasServices from '~/services/medias.services'

export const uploadImageController = async (
  req: Request, //
  res: Response,
  next: NextFunction
) => {
  const url = await mediasServices.handleUploadImage(req)
  res.status(HTTP_STATUS.OK).json({
    message: 'Upload image successfully',
    url
  })

  //Code demo:
  // //**lý thuyết:
  // //+cung cấp dường dẫn đến folder chứa file này
  // //console.log(__dirname)
  // //+path.resolve('uploads') là đường dẫn mà mình mong muốn lưu file vào
  // //   console.log(path.resolve('uploads'))
  // //setup tắm lưới chặn
  // const form = formidable({
  //   maxFiles: 1, //tối đa 1 file thôi
  //   maxFileSize: 300 * 1024, //300kb - đọc docs để biết trên web npm
  //   keepExtensions: true, //giữ lại đuôi của file
  //   uploadDir: path.resolve('uploads')
  // })
  // //ép req phải đi qua cái lưới
  // form.parse(req, (err, fields, files) => {
  //   if (err) {
  //     throw err
  //   } else {
  //     //xử lý file
  //     //hiện trạng thái nếu thành công
  //     res.status(HTTP_STATUS.OK).json({
  //       message: 'Upload image successfully'
  //     })
  //   }
  // })
}

//upload video
export const uploadVideoController = async (
  req: Request, //
  res: Response,
  next: NextFunction
) => {
  const url = await mediasServices.handleUploadVideo(req)
  res.status(HTTP_STATUS.OK).json({
    message: 'Upload video successfully',
    url
  })
}
