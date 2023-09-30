import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { hotelService } from '@/services/hotels-service';

const getHotels = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;
  const hotels = await hotelService.getHotels(userId);
  res.status(httpStatus.OK).send(hotels);
};

export const hotelsControllers = {
  getHotels,
};
