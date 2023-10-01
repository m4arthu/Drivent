import httpStatus from 'http-status';
import supertest from 'supertest';
import { Hotel, TicketStatus } from '@prisma/client';
import {
  createEnrollmentWithAddress,
  createHotel,
  createRemoteAndWithHotelTicketType,
  createTicket,
  createTicketType,
  createUser,
} from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import app, { init } from '@/app';
import { getTicket } from '@/controllers';

const server = supertest(app);

beforeEach(async () => {
  await init();
  await cleanDb();
});

describe('GET /hotels', () => {
  test('Shold return 401 when a valid token  is missing', async () => {
    const { status } = await server.get('/hotels');
    expect(status).toBe(httpStatus.UNAUTHORIZED);
  });

  test('Shold status be  404 when user enrolment does not exist', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const { status, body } = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(status).toBe(httpStatus.NOT_FOUND);
  });

  test('Should status be 402 when user ticket  is not paid', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
    const { status } = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(status).toBe(httpStatus.PAYMENT_REQUIRED);
  });

  test('shold return the hotels and status 200 when ticket is paid', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createRemoteAndWithHotelTicketType();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    await createHotel();
    const { status, body } = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(status).toBe(httpStatus.OK);
    expect(body).toEqual(
      expect.arrayContaining([
        expect.objectContaining<Hotel>({
          id: expect.any(Number),
          name: expect.any(String),
          image: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      ]),
    );
  });
});

describe('GET /hotels/:id', () => {
  test('Shold return 401 when a valid token  is missing', async () => {
    const { status } = await server.get('/hotels/1');
    expect(status).toBe(httpStatus.UNAUTHORIZED);
  });

  test('Shold return 402 with valid token but no enrolment or ticket is not paid or remote or not includ a hotel', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    const hotel = await createHotel();
    const { status } = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);
    expect(status).toBe(httpStatus.PAYMENT_REQUIRED);
  });

  test('Should return 200 and a hotel with room when user have a valid ticket', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createRemoteAndWithHotelTicketType();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    const hotel = await createHotel();
    // criar room para o hotel
    const { status, body } = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);
    expect(status).toBe(httpStatus.OK);
    // validar o  body
  });
});
