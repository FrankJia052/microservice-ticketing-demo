import { Publisher, Subjects, TicketUpdatedEvent } from "@tickets0808/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated
}