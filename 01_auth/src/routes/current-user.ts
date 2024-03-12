import express from "express";
import { currentUser } from "@tickets0808/common";
import { requireAuth } from "@tickets0808/common";

const router = express.Router()

router.get('/api/users/currentuser', currentUser, (req, res) => {
    res.send({ currentUser: req.currentUser || null})
})

export { router as currentUserRouter}