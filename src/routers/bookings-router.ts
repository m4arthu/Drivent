import { bookingController } from "@/controllers/booking-controller";
import { authenticateToken } from "@/middlewares";
import  {Router} from "express"

const bookingRouter = Router();

bookingRouter
.all('/*', authenticateToken)
.get('/', bookingController.getUserBooking)
.post('/',bookingController.postBooking)
.put('/:id',bookingController.putBooking)
export {bookingRouter}