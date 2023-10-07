import { prisma } from "@/config"
import { notFoundError } from "@/errors"
import { forbidenError } from "@/errors/room-fully-error"
import { enrollmentRepository, ticketsRepository } from "@/repositories"
import { bookingRepository } from "@/repositories/booking-repository"

const getBooking = async (userId: number) => {
    const booking = await bookingRepository.getBooking(userId)
    if (!booking) {
        throw notFoundError()
    }
    return booking
}

const postBooking = async (userId: number, roomId: number) => {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId)
    if (!enrollment) throw forbidenError()
    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id)
    if (ticket.TicketType.isRemote || !ticket.TicketType.includesHotel || ticket.status !== "PAID" || !ticket) {
        throw forbidenError()
    }
    const room = await prisma.room.findUnique({ where: { id: roomId } })
    if (!room) throw notFoundError()
    const bookings = await prisma.booking.findMany({ where: { roomId: roomId } })
    if (bookings.length === room.capacity) throw forbidenError()
    const createBooking = await bookingRepository.postBooking(userId, roomId)
    return createBooking.id
}

const putBooking = async (userId: number, roomId: number) => {
    const booking = await prisma.booking.findFirst({where:{userId:userId}})
    if (!booking) throw forbidenError()
    const bookingIsNotFree = await prisma.booking.findFirst({ where: { roomId: roomId } })
    if (bookingIsNotFree) throw forbidenError()
    console.log(roomId)
    const room = await prisma.room.findFirst({ where: { id: roomId } })
    if (!room) throw notFoundError()
    const bookings = await prisma.booking.findMany({ where: { roomId: roomId } })
    if (bookings.length === room.capacity) throw forbidenError()

    const reBooking = await bookingRepository.putBooking(userId, roomId)
    return reBooking.id


}

export const bookingServices = {
    getBooking,
    postBooking,
    putBooking
}