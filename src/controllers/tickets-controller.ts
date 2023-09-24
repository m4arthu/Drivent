import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { ticketService } from '@/services';
import { notFoundError } from '@/errors';

export const getTicketsTypes = async (req: Request, res: Response) => {
  const ticketsTypes = await ticketService.getTicketTypes();
  res.send(ticketsTypes);
};

export const postTicket = async (req: AuthenticatedRequest, res: Response) => {
  const { ticketTypeId } = req.body;
  const ticketCreated = await ticketService.postTicket(ticketTypeId, req.userId);
  res.status(httpStatus.CREATED).send(ticketCreated);
};
export const getTicktes = async (req: AuthenticatedRequest, res: Response) => {
  const UserId = req.userId;
  const ticket = await ticketService.getTicktesByUser(UserId);
  if (!ticket) {
    throw notFoundError();
  }
  res.send(ticket);
};
