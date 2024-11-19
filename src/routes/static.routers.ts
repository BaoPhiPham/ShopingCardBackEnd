import express, { Router } from 'express'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from '~/constants/dir'
import { serveImageController, serveVideoController } from '~/controllers/static.controllers'

const staticRouter = Router()
// staticRouter.use('/image', express.static(UPLOAD_IMAGE_DIR))
staticRouter.get('/image/:namefile', serveImageController)
//:namefile là param, chỉ có param đc liệt kê trên thanh router, query ko đc
// staticRouter.get('/video/:namefile', serveVideoController)//này là đưa nguyên file video cho ng dùng, ko chia đoạn ra
// staticRouter.use('/video', express.static(UPLOAD_VIDEO_DIR)) //ko nên xài
staticRouter.get('/video/:namefile', serveVideoController)

export default staticRouter
