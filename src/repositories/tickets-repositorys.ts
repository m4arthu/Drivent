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
    'createdAt', to_char("TicketType"."createdAt", 'YYYY-MM-DD"T"HH24:MI:SS.MS') || 'Z',
    'updatedAt', to_char("TicketType"."updatedAt", 'YYYY-MM-DD"T"HH24:MI:SS.MS') || 'Z') AS "TicketType" FROM "Ticket" 

   JOIN "TicketType" ON
   "TicketType".id = ${ticket.ticketTypeId}   
   where "Ticket"."ticketTypeId" = ${ticket.ticketTypeId}
   GROUP BY "Ticket".id, "TicketType".id
   ;`;
  createdTicket[0].createdAt = new Date(createdTicket[0].createdAt);
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
