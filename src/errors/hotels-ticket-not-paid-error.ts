import { ApplicationError } from "@/protocols"

export const ticketNotPaid = ():ApplicationError => {
    return {
        name: 'TicketNotPaid',
        message: 'User Ticket is not paid.',
      };
}