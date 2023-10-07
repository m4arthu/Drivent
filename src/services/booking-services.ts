import { prisma } from "@/config"
import { notFoundError } from "@/errors"
import { forbidenError } from "@/errors/room-fully-error"
import { enrollmentRepository, ticketsRepository } from "@/repositories"
import { bookingRepository } from "@/repositories/booking-repository"

const  getBooking = async (userId: number) =>  {
   const booking  = await bookingRepository.getBooking(userId)
   if(!booking){
    throw notFoundError()
   }
   return booking
}

const postBooking = async (userId:number,roomId:number) => {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId)
    if(!enrollment) throw forbidenError()
    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id)
    if(ticket.TicketType.isRemote || !ticket.TicketType.includesHotel || ticket.status !== "PAID" || !ticket) {
        throw forbidenError()
    }
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