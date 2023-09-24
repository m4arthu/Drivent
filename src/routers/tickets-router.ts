import { Router } from 'express';
import { getTicketsTypes, getTicktes, postTicket } from '@/controllers/tickets-controller';
import { authenticateToken, validateBody } from '@/middlewares';
import { ticketSchema } from '@/schemas';

const ticketsRouter = Router();

ticketsRouter
  .all('/*', authenticateToken)
  .get('/types', getTicketsTypes)
  .get('/', getTicktes)
  .post('/', validateBody(ticketSchema), postTicket);

export { ticketsRouter };
