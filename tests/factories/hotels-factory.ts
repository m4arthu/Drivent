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
