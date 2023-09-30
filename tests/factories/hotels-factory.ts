import { prisma } from "@/config"
import faker from "@faker-js/faker"

export const createHotel =  () => {
    return prisma.hotel.create({
        data : {
            name: faker.company.bsBuzz(),
            image : faker.image.imageUrl(),
        }
    })
}