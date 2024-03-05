import express from "express";

const router = express.Router()

router.get('/api/users/currentuser', (req, res) => {
    res.send("Hi, this is current user service")
})

export { router as currentUserRouter}