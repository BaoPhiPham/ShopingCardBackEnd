import path from 'path'
import fs from 'fs' //1 modules chứa các method xử lý file
import { UPLOAD_IMAGE_TEMP_DIR, UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from '~/constants/dir'
import { Request } from 'express'
import formidable, { File } from 'formidable'
import { ErrorWithStatus } from '~/models/Errors'

export const initFolder = () => {
  //lưu đường dẫn đến thư mục sẽ lưu file
  //const uploadsFolderPath = path.resolve('uploads')
  //truy vết đường link này xem có đến đc thư mục này ko ?
  //nếu mà tìm ko đc thì tạo mới thư mục
  // if (!fs.existsSync(uploadsFolderPath)) {
  //   fs.mkdirSync(uploadsFolderPath, {
  //     recursive: true // cho phép tạo lồng các thư mục trong tương lai nếu cần
  //   })
  // }

  ;[UPLOAD_IMAGE_TEMP_DIR, UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true // cho phép tạo lồng các thư mục trong tương lai nếu cần
      })
    }
  })
}

//tạo hàm handleUploadImage: hàm nhận vào vào req
//ép req phải đi qua tấm lưới lọc formidable
//từ đó lấy đc các file trong req , thì chọn ra các file là Image
//return các file đó ra ngoài

//up ảnh
export const handleUploadImage = async (req: Request) => {
  //tạo lưới lọc từ formidable
  const form = formidable({
    uploadDir: UPLOAD_IMAGE_TEMP_DIR,
    maxFiles: 4, //tối đa 1 file
    maxTotalFileSize: 300 * 1024 * 4,
    maxFileSize: 300 * 1024, //300kb
    keepExtensions: true, //gửi lại dưới dạng
    filter: ({ name, originalFilename, mimetype }) => {
      //name là field đc gửi thông qua form <input name = 'fileNe'> là key trong postmain
      //originalFilename: tên gốc của file
      //mimetype: kiểu định dạng file 'videp/mp4', 'video/mkv', 'image/png', 'image/jpe'
      const valid = name === 'image' && Boolean(mimetype?.includes('image'))
      if (!valid) {
        form.emit('error' as any, new Error('File Type Invalid!!!') as any)
      }
      return valid // true
    }
  })
  //có lưới rồi thì ép req vào
  //import đúng file của formidable
  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err)
      if (!files.image) return reject(new Error('Image is empty'))
      return resolve(files.image)
    }) //=> hàm này chạy khi req đc ép vào
    //những hàm có callback chứa err thì mặc định bất dồng bộ => promise
  })
}

//viết hàm nhận vào full filename và chỉ lấy tên bỏ đuôi
export const getNameFromfileName = (filename: string) => {
  const nameArr = filename.split('.')
  nameArr.pop()
  return nameArr.join('-')
}

//up video
export const handleUploadVideo = async (req: Request) => {
  //tạo lưới lọc từ formidable
  const form = formidable({
    uploadDir: UPLOAD_VIDEO_DIR,
    maxFiles: 1, //tối đa 1 file
    maxFileSize: 50 * 1024 * 1024, //50mb
    keepExtensions: true, //gửi lại dưới dạng
    filter: ({ name, originalFilename, mimetype }) => {
      //name là field đc gửi thông qua form <input name = 'fileNe'> là key trong postmain
      //originalFilename: tên gốc của file
      //mimetype: kiểu định dạng file 'videp/mp4', 'video/mkv', 'image/png', 'image/jpe'
      const valid = name === 'video' && Boolean(mimetype?.includes('video'))
      if (!valid) {
        form.emit('error' as any, new Error('File Type Invalid!!!') as any)
      }
      return valid // true
    }
  })
  //có lưới rồi thì ép req vào
  //import đúng file của formidable
  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err)
      if (!files.video) return reject(new Error('Video is empty'))
      return resolve(files.video)
    }) //=> hàm này chạy khi req đc ép vào
    //những hàm có callback chứa err thì mặc định bất dồng bộ => promise
  })
}
