import app, { init } from "@/app"
import httpStatus from "http-status"
import supertest from "supertest"
import { cleanDb, generateValidToken } from "../helpers"
import {Room } from "@prisma/client"
import {GetBooking} from "@/protocols"
import { createEnrollmentWithAddress, createTicket, createTicketType, createUser } from "../factories"
import { createHotel, createRoomWithHotelId } from "../factories/hotels-factory"
import { createBooking } from "../factories/booking-factory"

const server  = supertest(app)
beforeEach(async()=>{
    await init()
    await cleanDb()
})

describe("Get /booking",  ()=>{

    test("Shold return 401 when user token is  invalid or missing",async()=>{
        const {status} = await server.get("/booking")
        expect(status).toBe(httpStatus.UNAUTHORIZED)
    })

    test("Should return status  200 with booking when token and ticket is valid",async()=>{

        const user = await createUser()
        const token = await generateValidToken(user)
        const hotel  = await createHotel()
        const room = await createRoomWithHotelId(hotel.id)
        const enrolment = await createEnrollmentWithAddress(user)
        const ticketType = await createTicketType(false,true)
        await createTicket(enrolment.id,ticketType.id,"PAID")
        await createBooking(room.id,user.id)
        
       const response = await server.get("/booking").set("Authorization", `Bearer ${token}`)
       expect(response.status).toBe(httpStatus.OK)
       expect(response.body).toEqual(expect.objectContaining<GetBooking>({
            id : expect.any(Number),
            Room : expect.objectContaining<Room>({
                id :  expect.any(Number),
                capacity : expect.any(Number) ,
                createdAt : expect.any(String),
                hotelId: expect.any(Number) , 
                name : expect.any(String) , 
                updatedAt : expect.any(String) ,
            })
       }))
    })
})

describe("POST /booking",()=>{
    
    test("Should return 404 when token  is valid and roomId does not exist", async()=>{
        const token  = await generateValidToken()
        const {status} = await server.post("/booking").send({roomId: 1}).set("Authorization", `Bearer ${token}`)
        expect(status).toBe(httpStatus.FORBIDDEN)
    })

    test("Should return 200 with  the  bookingId when token  is valid and roomId  exist", async()=>{
        const user = await createUser()
        const token = await generateValidToken(user)
        const hotel  = await createHotel()
        const room = await createRoomWithHotelId(hotel.id)
        const enrolment = await createEnrollmentWithAddress(user)
        const ticketType = await createTicketType(false,true)
        await createTicket(enrolment.id,ticketType.id,"PAID")
        
        const {status,body} = await server.post("/booking").send({roomId: room.id}).set("Authorization", `Bearer ${token}`)
        expect(status).toBe(httpStatus.OK)
        expect(body).toEqual(expect.objectContaining({
            bookingId: expect.any(Number)
        }))
    })
})