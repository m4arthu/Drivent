import { strict } from 'assert';
import httpStatus from 'http-status';
import supertest from 'supertest';
import { Hotel } from '@prisma/client';
import { createHotel } from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import app, { init } from '@/app';

const server = supertest(app);

beforeAll(async () => {
  await init();
  await cleanDb();
});

describe('GET /hotels', () => {
  test('shold return 401 when token  is missing', async () => {
    const { status } = await server.get('/hotels');
    expect(status).toBe(httpStatus.UNAUTHORIZED);
  });
  test('shold return the hotels and status 200', async () => {
    await createHotel();
    const token = await generateValidToken();
    const { status, body } = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    console.log(body);
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
