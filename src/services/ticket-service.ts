import { prisma } from '@/config';
import { notFoundError } from '@/errors';
import { CreateTicket } from '@/protocols';
import { enrollmentRepository, ticketsRepository } from '@/repositories';

async function getTicketTypes() {
  const ticketTypes = await ticketsRepository.getTickes();
  return ticketTypes;
}
async function postTicket(ticketTypeId: number, userId: number) {
  const ticketType = await prisma.ticketType.findFirst({ where: { id: ticketTypeId } });
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  const createTicket: CreateTicket = {
    status: 'RESERVED',
    ticketTypeId: ticketTypeId,
    enrollmentId: enrollment.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  return await ticketsRepository.postTickets(createTicket);
}

async function getTicktesByUser(authorization: string) {
  const token = authorization.replace('Bearer ', '');
  const user = await prisma.session.findFirst({ where: { token } });
  /// pegar tickets do  repositorio e  ajeitar os comendos por la
}
export const ticketService = {
  postTicket,
  getTicketTypes,
  getTicktesByUser,
};