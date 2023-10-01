import faker from '@faker-js/faker';
import { prisma } from '@/config';

export const createHotel = () => {
  return prisma.hotel.create({
    data: {
      name: faker.company.bsBuzz(),
      image: faker.image.imageUrl(),
    },
  });
};
export const createRooms = (hotelId: number) => {
  return prisma.room.create({
    data: {
      capacity: 2,
      name: faker.company.bsBuzz(),
      hotelId: hotelId,
    },
  });
};
