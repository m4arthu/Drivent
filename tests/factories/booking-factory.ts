import { prisma } from "@/config"

export const createBooking = (roomId:number, userId:number) => {
    return prisma.booking.create({
        data:{roomId:roomId, userId:userId}
    })
}