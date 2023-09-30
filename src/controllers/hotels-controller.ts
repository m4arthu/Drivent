import { Response } from "express"
import { AuthenticatedRequest } from "@/middlewares"
import { hotelService } from "@/services/hotels-service"
import httpStatus from "http-status"

const getHotels = async(req:AuthenticatedRequest,res:Response) =>{
    const userId = req.userId
    const hotels = await hotelService.getHotels(userId)
    res.status(httpStatus.OK).send(hotels)
}


export const hotelsControllers = {
    getHotels
}