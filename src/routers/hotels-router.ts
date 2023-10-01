import { Router } from 'express';
import { hotelsControllers } from '@/controllers';
import { authenticateToken } from '@/middlewares';

const hotelsRouter = Router();

hotelsRouter
  .all('/*', authenticateToken)
  .get('/', hotelsControllers.getHotels)
  .get('/:id', hotelsControllers.getHotelsById);

export { hotelsRouter };
