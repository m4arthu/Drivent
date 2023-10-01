import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { hotelService } from '@/services/hotels-service';

const getHotels = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;
  const hotels = await hotelService.getHotels(userId);
  res.status(httpStatus.OK).send(hotels);
};

const getHotelsById = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;
  const hotelId = req.params.id;
  const hotels = await hotelService.getHotelsById(userId, Number(hotelId));
  res.sendStatus(httpStatus.OK).send(hotels);
};
export const hotelsControllers = {
  getHotels,
  getHotelsById,
};
