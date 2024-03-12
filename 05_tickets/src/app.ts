import express from "express"
import cookieSession from "cookie-session"
import {NotFoundError, errorHandler} from "@tickets0808/common"

const app = express()
app.set("trust proxy", true)
app.use(express.json())

app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test"
}))

app.all("*", () => {
    throw new NotFoundError();
})

app.use(errorHandler)

export { app }

