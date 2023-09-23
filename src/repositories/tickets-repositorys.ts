import { prisma } from '@/config';
import { CreateTicket } from '@/protocols';

type CreateTicketresponse = {
  id: number;
  status: string; //RESERVED | PAID
  ticketTypeId: number;
  enrollmentId: number;
  TicketType: {
    id: number;
    name: string;
    price: number;
    isRemote: boolean;
    includesHotel: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
};

const postTickets = async (ticket: CreateTicket) => {
  await prisma.ticket.create({
    data: ticket,
  });
  const createdTicket: CreateTicketresponse[] = await prisma.$queryRaw`
   SELECT "Ticket".*,
    json_build_object(
    'id', "TicketType".id,
    'name', "TicketType".name,
    'price', "TicketType".price,
    'isRemote', "TicketType"."isRemote",
    'includesHotel', "TicketType"."includesHotel",
    'createdAt', "TicketType"."createdAt",
    'updatedAt', "TicketType"."updatedAt") AS "TicketType" FROM "Ticket" 

   JOIN "TicketType" ON
   "TicketType".id = ${ticket.ticketTypeId}   
   where "Ticket"."ticketTypeId" = ${ticket.ticketTypeId}
   GROUP BY "Ticket".id, "TicketType".id
   ;`;

  return createdTicket[0];
};

const getTickes = async () => {
  const ticketstypes = await prisma.ticketType.findMany();
  return ticketstypes;
};

export const ticketsRepository = {
  postTickets,
  getTickes,
};
