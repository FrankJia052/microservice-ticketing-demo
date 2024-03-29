import express from "express";
import 'express-async-errors'
import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler } from "@tickets0808/common";
import { NotFoundError } from "@tickets0808/common";
import cookieSession from "cookie-session";

const app = express()
// 这行代码的作用是告诉 Express 应用，它位于一个代理服务器之后，并且代理服务器可能会修改请求头，例如 X-Forwarded-For 和 X-Forwarded-Proto。通过设置 'trust proxy' 为 true，Express 应用会信任代理服务器发送过来的请求头，以便正确处理客户端的 IP 地址和协议信息。
app.set('trust proxy', true)
app.use(express.json())

app.use(cookieSession({
    // disable encryption on this cookie 不用识别签名，用户可以更改cookie内容。JWT已经加密过了。
    signed: false,
    // only http connection can transport the cookie
    secure: process.env.NODE_ENV !== 'test',
}))

app.use(currentUserRouter)
app.use(signinRouter)
app.use(signoutRouter)
app.use(signupRouter)

app.all('*', () => {
    throw new NotFoundError()
})

app.use(errorHandler)

export {app};