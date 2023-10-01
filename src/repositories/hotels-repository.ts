import { prisma } from '@/config';
import { HotelWithRooms } from '@/protocols';

const getHotels = async () => {
  const hotels = await prisma.hotel.findMany();
  return hotels;
};

const getHotelWithRooms = async (hotelId: number) => {
  const hotel = await prisma.hotel.findFirst({ where: { id: hotelId } });
  const rooms = await prisma.room.findMany({ where: { hotelId: hotelId } });

  const result: HotelWithRooms = { ...hotel, Rooms: rooms };
  return result;
};

const hotelsRepository = {
  getHotels,
  getHotelWithRooms,
};
export { hotelsRepository };
