import { hotelsRepository } from "@/repositories"



const getHotels = async (userId: number) => {
   // await verifyUserEnrollment(userId)
    const hotels = hotelsRepository.getHotels()
    return hotels
}

const verifyUserEnrollment = async (userId: number) =>{
    
}

export const hotelService = {
    getHotels
}