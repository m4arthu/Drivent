import { prisma } from '@/config';

const getHotels = async () => {
  const hotels = await prisma.hotel.findMany();
  return hotels;
};

const hotelsRepository = {
  getHotels,
};
export { hotelsRepository };
