import { prisma } from "@/config"
import { notFoundError } from "@/errors"
import { forbidenError } from "@/errors/room-fully-error"
import { bookingRepository } from "@/repositories/booking-repository"

const  getBooking = async (userId: number) =>  {
   const booking  = await bookingRepository.getBooking(userId)
   if(booking.id === undefined){
    throw notFoundError()
   }
   return booking
}

const postBooking = async (userId:number,roomId:number) => {
    const room  = await  prisma.room.findUnique({where:{id:roomId}})
    if(!room) throw notFoundError()
    const bookings =  await prisma.booking.findMany({where:{roomId:roomId}})
    if(bookings.length === room.capacity) throw forbidenError()
    const createBooking = await bookingRepository.postBooking(userId,roomId)
    return createBooking.id
}

export const  bookingServices  = {
    getBooking,
    postBooking
}