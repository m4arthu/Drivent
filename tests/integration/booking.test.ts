import app, { init } from "@/app"
import httpStatus from "http-status"
import supertest from "supertest"
import { cleanDb, generateValidToken } from "../helpers"
import {Room } from "@prisma/client"
import {GetBooking} from "@/protocols"
import { createUser } from "../factories"
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

    test("Should return status  200 with booking when token is valid",async()=>{
        const user = await createUser()
        const token = await generateValidToken(user)
        const hotel  = await createHotel()
        const room = await createRoomWithHotelId(hotel.id)
        const booking = await createBooking(room.id,user.id)
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
 
    test("Should return 404 when token  is valid and roomId does not exist", async()=>{
        const token  = await generateValidToken()
        const {status} = await server.post("/booking").send({roomId: 1}).set("Authorization", `Bearer ${token}`)
        expect(status).toBe(httpStatus.NOT_FOUND)
    })


})