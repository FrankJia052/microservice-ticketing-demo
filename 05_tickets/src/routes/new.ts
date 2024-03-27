import { BadRequestError, requireAuth, validateRequest } from "@tickets0808/common";
import express, {Request, Response} from "express";
import { body } from "express-validator"
import { Ticket } from "../models/Ticket";
import { TicketCreatedPublisher } from "../events/publisher/ticket-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post("/api/tickets", requireAuth, [
    body("title")
        .not()
        .isEmpty()
        .withMessage("Title is required"),
    body("price")
        .isFloat({ gt: 0 })
        .withMessage("Price must be greater than 0")
], 
    validateRequest
, async (req: Request, res: Response) => {
    const {title, price} = req.body
    try {
        const ticket = Ticket.build({
            title,
            price,
            userId: req.currentUser!.id
        })
        await ticket.save();
        new TicketCreatedPublisher(natsWrapper.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId
        })
        return res.status(201).send(ticket);
    } catch (err) {
        throw new BadRequestError("Faild to store ticket")
    }
})

export { router as createTicketRouter };