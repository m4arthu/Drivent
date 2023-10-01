import { ticketsService } from './tickets-service';
import { hotelsRepository } from '@/repositories';
import { ticketNotPaid } from '@/errors/hotels-ticket-not-paid-error';
import { notFoundError } from '@/errors';

const getHotels = async (userId: number) => {
  await verifyUserEnrollmentAndTicket(userId);
  const hotels = hotelsRepository.getHotels();
  return hotels;
};

const verifyUserEnrollmentAndTicket = async (userId: number) => {
  const ticket = await ticketsService.getTicketByUserId(userId);
  if (ticket.status !== 'PAID' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw ticketNotPaid();
  }
};

const getHotelsById = async (userId: number, hotelId: number) => {
  await verifyUserEnrollmentAndTicket(userId);
  const hotel = await hotelsRepository.getHotelWithRooms(hotelId);
  if (!hotel) throw notFoundError();
  return hotel;
};

export const hotelService = {
  getHotels,
  getHotelsById,
};
