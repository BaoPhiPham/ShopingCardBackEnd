import { Request } from 'express'
import sharp from 'sharp'
import { UPLOAD_IMAGE_DIR } from '~/constants/dir'
import { getNameFromfileName, handleUploadImage, handleUploadVideo } from '~/utils/file'
import fs from 'fs'
import { Media } from '~/models/Other'
import { MediaType } from '~/constants/enums'

class MediasServices {
  async handleUploadImage(req: Request) {
    const files = await handleUploadImage(req)
    const result = await Promise.all(
      files.map(async (file) => {
        //giống tên nghĩa là hàm độ lại từ hàm xuất hiện trong thư viện riêng của mìnhW
        const newFilename = getNameFromfileName(file.newFilename) + '.jpg'
        //đường dẫn đến file mới sẽ là
        const newPath = UPLOAD_IMAGE_DIR + '/' + newFilename
        //dùng sharp để nén file lại và lưu vào newPath
        await sharp(file.filepath).jpeg().toFile(newPath)
        //setup đường link: static là chia sẽ cho các object con dùng chung
        fs.unlinkSync(file.filepath) //xóa hình cũ
        const url: Media = {
          url: `http://localhost:3000/static/image/${newFilename}`, //
          type: MediaType.Image
        }
        return url
      })
    )
    return result
  }

  async handleUploadVideo(req: Request) {
    const files = await handleUploadVideo(req)
    const result = await Promise.all(
      files.map(async (file) => {
        const url: Media = {
          url: `http://localhost:3000/static/video/${file.newFilename}`, //
          type: MediaType.Video
        }
        return url
      })
    )
    return result
  }
}
const mediasServices = new MediasServices()
export default mediasServices
