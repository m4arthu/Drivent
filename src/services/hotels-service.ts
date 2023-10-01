import { hotelsRepository } from '@/repositories';
import { ticketsService } from './tickets-service';
import { ticketNotPaid } from '@/errors/hotels-ticket-not-paid-error';

const getHotels = async (userId: number) => {
  await verifyUserEnrollmentAndTicket(userId)
  const hotels = hotelsRepository.getHotels();
  return hotels;
};

const verifyUserEnrollmentAndTicket = async (userId: number) => {
  const ticket = await ticketsService.getTicketByUserId(userId)
  if(ticket.status !== "PAID"){
     throw ticketNotPaid()
  }
};

export const hotelService = {
  getHotels,
};
