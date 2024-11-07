import express from 'express'
import userRouter from './routes/users.routers'
import databaseServices from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'

// dùng ẽxpress tạo server
const app = express()
const PORT = 3000
databaseServices.connect() // ket noi database
// cho server chay middleware chuyen json
app.use(express.json())
//handler
//server dùng userRouter
app.use('/users', userRouter)

//xu ly loi tong
userRouter.use(defaultErrorHandler)

//app mở ở PORT 3000
// localhost3000/uses/login  req.body{emai, password}
app.listen(PORT, () => {
  console.log('SERVER BE đang chạy ở PORT: ' + PORT)
})
