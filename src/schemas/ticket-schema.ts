import { Ticket } from '@prisma/client';
import Joi from 'joi';

export const ticketSchema = Joi.object<Ticket>({
  ticketTypeId: Joi.number().integer().positive().required(),
});
