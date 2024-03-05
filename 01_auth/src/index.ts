import express from "express";
import 'express-async-errors'
import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";
import mongoose from 'mongoose'
import cookieSession from "cookie-session";

const app = express()
// 这行代码的作用是告诉 Express 应用，它位于一个代理服务器之后，并且代理服务器可能会修改请求头，例如 X-Forwarded-For 和 X-Forwarded-Proto。通过设置 'trust proxy' 为 true，Express 应用会信任代理服务器发送过来的请求头，以便正确处理客户端的 IP 地址和协议信息。
app.set('trust proxy', true)
app.use(express.json())

app.use(cookieSession({
    // disable encryption on this cookie 不用识别签名，用户可以更改cookie内容。JWT已经加密过了。
    signed: false,
    // only http connection can transport the cookie
    secure: true,
}))

app.use(currentUserRouter)
app.use(signinRouter)
app.use(signoutRouter)
app.use(signupRouter)

app.all('*', () => {
    throw new NotFoundError()
})

app.use(errorHandler)

const start = async () => {
    if(!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined')
    }
    try {
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth')
        console.log("Connected to MongoDb")
    } catch (err) {
        console.error(err)
    }
    app.listen(3000, () => {
        console.log('Auth Server is listening on port 3000!')
    })
}

start()