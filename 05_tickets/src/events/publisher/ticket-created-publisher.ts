import { Publisher, Subjects, TicketCreatedEvent } from "@tickets0808/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated
}