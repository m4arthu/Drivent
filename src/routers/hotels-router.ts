import { hotelsControllers } from "@/controllers"
import { authenticateToken } from "@/middlewares"
import  {Router} from "express"

const hotelsRouter = Router()

hotelsRouter
.all("/",authenticateToken)
.get("/",hotelsControllers.getHotels)

export {hotelsRouter}