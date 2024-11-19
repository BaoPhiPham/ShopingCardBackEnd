import { Router } from 'express'
import { uploadImageController, uploadVideoController } from '~/controllers/medias.controllers'
import { wrapAsync } from '~/utils/handlers'

const mediaRouter = Router()

//route upload 1 hình
mediaRouter.post('/upload-image', wrapAsync(uploadImageController))
mediaRouter.post('/upload-video', wrapAsync(uploadVideoController))

export default mediaRouter
