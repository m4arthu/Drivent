import { prisma } from '@/config';
import { notFoundError } from '@/errors';
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
  createdTicket[0].updatedAt = new Date(createdTicket[0].updatedAt);
  return createdTicket[0];
};

const getTickesTypes = async () => {
  const ticketstypes = await prisma.ticketType.findMany();
  return ticketstypes;
};

const getTickets = async (enrollmentId: number) => {
  const ticket = await prisma.ticket.findFirst({ where: { enrollmentId: enrollmentId } });
  if (!ticket) {
    throw notFoundError();
  }

  const userTicket: CreateTicketresponse[] = await prisma.$queryRaw`
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
  userTicket[0].createdAt = new Date(userTicket[0].createdAt);
  userTicket[0].updatedAt = new Date(userTicket[0].updatedAt);
  return userTicket[0];
};

export const ticketsRepository = {
  postTickets,
  getTickesTypes,
  getTickets,
};
