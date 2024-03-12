import express, { Request, Response } from "express";
import { body } from "express-validator";
import { User } from "../models/User";
import { BadRequestError } from "@tickets0808/common";
import jwt from 'jsonwebtoken'
import { validateRequest } from "@tickets0808/common";

const router = express.Router()

router.post('/api/users/signup', [
    // validation 验证 email 和 password
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('Password Must Between 4 - 20 characters')
],
    validateRequest
    , async (req: Request, res: Response) => {
        const { email, password } = req.body

        const existingUser = await User.findOne({ email })

        if (existingUser) {
            throw new BadRequestError("Email in use")
        }

        const user = User.build({
            email,
            password
        })

        // Generate JWT
        const userJwt = jwt.sign({
            id: user.id,
            email: user.email
        },
            process.env.JWT_KEY!
        )
        // Store it on session object
        req.session = {
            jwt: userJwt
        }

        await user.save()
        res.status(201).send(user)
    })

export { router as signupRouter }