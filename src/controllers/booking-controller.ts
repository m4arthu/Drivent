import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import { bookingServices } from "@/services/booking-services";
import { unauthorizedError } from "@/errors";
const  getUserBooking = async (req:AuthenticatedRequest, res:Response) =>{
    const userId = req.userId
    if(isNaN(userId)) throw unauthorizedError()
    const bookingId  = await bookingServices.getBooking(userId)
    res.send(bookingId)
}

const postBooking = async () => {

}

export const bookingController = {
    getUserBooking
}
