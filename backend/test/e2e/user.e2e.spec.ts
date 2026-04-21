import { INestApplication, ValidationPipe } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { UserModule } from '../../src/module/user.module';

describe('User E2E Tests', () => {
  const mockUser = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    cpf: '69854662063',
    birthDate: '1990-01-01',
    phone: '11999999999',
  };
  let app: INestApplication;
  let mongoServer: MongoMemoryServer;
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), { dbName: 'user-crud' });
    const module: TestingModule = await Test.createTestingModule({
      imports: [MongooseModule.forRoot(mongoServer.getUri()), UserModule],
      controllers: [],
      providers: [],
    }).compile();
    app = module.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
    app.getHttpServer();
  });
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });
  describe('POST /api/user', () => {
    it('should create a user', async () => {
      const response = await request
        .agent(app.getHttpServer() as App)
        .post('/api/user')
        .send(mockUser)
        .expect(201);
      expect(response.body).toHaveProperty('name', mockUser.name);
      expect(response.body).toHaveProperty('email', mockUser.email);
      expect(response.body).toHaveProperty('cpf', mockUser.cpf);
      expect(response.body).toHaveProperty('birthDate', mockUser.birthDate);
      expect(response.body).toHaveProperty('phone', mockUser.phone);
    });
    it('should throw error 409 if user already exists', async () => {
      await request
        .agent(app.getHttpServer() as App)
        .post('/api/user')
        .send(mockUser)
        .expect(409);
    });
    it('should throw error invalid payload', async () => {
      const { ...user } = mockUser;
      delete user.name;
      await request
        .agent(app.getHttpServer() as App)
        .post('/api/user')
        .send(user)
        .expect(400);
    });
  });
  describe('GET /api/user', () => {
    it('should return all users', async () => {
      const response: {
        body: { result: Array<typeof mockUser & { _id: string }> };
      } = await request
        .agent(app.getHttpServer() as App)
        .get('/api/user')
        .expect(200);
      expect(Array.isArray(response.body.result)).toBe(true);
      if (!Array.isArray(response.body.result)) {
        return;
      }
      expect(response.body.result.length).toBeGreaterThan(0);
      expect(response.body.result[0]).toHaveProperty('name', mockUser.name);
      expect(response.body.result[0]).toHaveProperty('email', mockUser.email);
      expect(response.body.result[0]).toHaveProperty('cpf', mockUser.cpf);
      expect(response.body.result[0]).toHaveProperty(
        'birthDate',
        mockUser.birthDate,
      );
      expect(response.body.result[0]).toHaveProperty('phone', mockUser.phone);
    });
  });
  describe('GET /api/user/:id', () => {
    let userId: string;
    beforeAll(async () => {
      const response: {
        body: { result: Array<typeof mockUser & { _id: string }> };
      } = await request.agent(app.getHttpServer() as App).get('/api/user');
      const { result } = response.body;
      if (Array.isArray(result) && result.length > 0 && result[0]._id) {
        userId = result[0]._id;
      }
    });
    it('should return a user', async () => {
      await request
        .agent(app.getHttpServer() as App)
        .get(`/api/user/${userId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('name', mockUser.name);
          expect(res.body).toHaveProperty('email', mockUser.email);
          expect(res.body).toHaveProperty('cpf', mockUser.cpf);
          expect(res.body).toHaveProperty('birthDate', mockUser.birthDate);
          expect(res.body).toHaveProperty('phone', mockUser.phone);
        });
    });
    it('should throw error 404 if user not found', async () => {
      await request
        .agent(app.getHttpServer() as App)
        .get('/api/user/69e00422589ef96735b25f12')
        .expect(404);
    });
    it('should throw CastError if id is not a valid ObjectId', async () => {
      await request
        .agent(app.getHttpServer() as App)
        .get('/api/user/invalid-id')
        .expect(400);
    });
  });
  describe('PATCH /api/user/:id', () => {
    let userId: string;
    beforeAll(async () => {
      const response: {
        body: { result: Array<typeof mockUser & { _id: string }> };
      } = await request.agent(app.getHttpServer() as App).get('/api/user');
      const { result } = response.body;
      if (Array.isArray(result) && result.length > 0 && result[0]._id) {
        userId = result[0]._id;
      }
    });
    it('should update a user', async () => {
      const reponse = await request
        .agent(app.getHttpServer() as App)
        .patch(`/api/user/${userId}`)
        .send({ name: 'John Doe Updated' })
        .expect(200);
      expect(reponse.body).toHaveProperty('affected', 1);
    });
    it('should throw return affected 0 if user not found', async () => {
      await request
        .agent(app.getHttpServer() as App)
        .patch('/api/user/69e00422589ef96735b25f12')
        .send({ name: 'John Doe Updated' })
        .expect({ affected: 0 });
    });
    it('should throw error invalid payload', async () => {
      await request
        .agent(app.getHttpServer() as App)
        .patch(`/api/user/${userId}`)
        .send({})
        .expect(400);
    });
  });
  describe('DELETE /api/user/:id', () => {
    let userId: string;
    beforeAll(async () => {
      const response: {
        body: { result: Array<typeof mockUser & { _id: string }> };
      } = await request.agent(app.getHttpServer() as App).get('/api/user');
      const { result } = response.body;
      if (Array.isArray(result) && result.length > 0 && result[0]._id) {
        userId = result[0]._id;
      }
    });
    it('should delete a user', async () => {
      const response = await request
        .agent(app.getHttpServer() as App)
        .delete(`/api/user/${userId}`)
        .expect(200);
      expect(response.body).toHaveProperty('affected', 1);
    });
    it('should throw error 404 if user not found', async () => {
      await request
        .agent(app.getHttpServer() as App)
        .delete('/api/user/69e00422589ef96735b25f12')
        .expect(404);
    });
  });
});
