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

const postBooking = async (req:AuthenticatedRequest, res:Response) => {
    const  {roomId} = req.body
    const userId  = req.userId
    const postBooking = await bookingServices.postBooking(userId,roomId)
    return postBooking // return  the id of  the booking if it created
}

export const bookingController = {
    getUserBooking
}
