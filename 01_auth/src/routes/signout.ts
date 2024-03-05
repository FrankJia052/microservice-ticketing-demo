import express from "express";

const router = express.Router()

router.post('/api/users/signout', (req, res) => {
    res.send("Hi, this is sign out service")
})

export { router as signoutRouter}