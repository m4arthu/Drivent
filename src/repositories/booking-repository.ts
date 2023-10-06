import { prisma } from "@/config"
import { GetBooking } from "@/protocols"


const getBooking = async (userId: number) => {
    const booking = await prisma.$queryRaw<GetBooking[]>`
     SELECT "Booking".id, 
  (
    SELECT json_build_object(
      'id', "Room".id,
      'capacity', "Room".capacity,
      'hotelId', "Room"."hotelId",
      'createdAt', "Room"."createdAt",
      'name', "Room".name,
      'updatedAt', "Room"."updatedAt"
    )
  ) as "Room"
  FROM "Booking" JOIN "Room" ON "Room".id = "Booking"."roomId"
 WHERE "Booking"."userId" = ${userId};`
    return booking[0]
}

const postBooking = async (userId:number,roomId:number) => {
   const booking  = await prisma.booking.create({
    data:{
      userId: userId,
      roomId: roomId
    }
   })
   return booking
  }

export const bookingRepository = {
    getBooking,
    postBooking
}