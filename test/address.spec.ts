import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('AddressController', () => {
  let app: INestApplication;
  let logger: Logger
  let testService: TestService

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER)
    testService = app.get(TestService)
  });

  describe("POST /api/contacts/:contactId/addresses", () => {
    beforeEach(async () => {
      await testService.deleteAddressess();
      await testService.deleteContact();
      await testService.deleteUser();

      await testService.createUser();
      await testService.createContact();
    })

    it("should be rejected if request is invalid", async () => {
      const contact = await testService.getContact()
      const response = await request(app.getHttpServer())
        .post(`/api/contacts/${contact.id}/addresses`)
        .set('Authorization', 'test')
        .send({
          street: '',
          city: '',
          provice: '',
          country: '',
          postal_code: ''
        })

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    })

    it("should be able create addresses", async () => {
      const contact = await testService.getContact()
      const response = await request(app.getHttpServer())
        .post(`/api/contacts/${contact.id}/addresses`)
        .set('Authorization', 'test')
        .send({
          street: 'bekasi',
          city: 'bekasi',
          province: 'bekasi',
          country: 'bekasi',
          postal_code: '17134'
        })

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.street).toBe("bekasi");
      expect(response.body.data.city).toBe("bekasi");
      expect(response.body.data.province).toBe("bekasi");
      expect(response.body.data.country).toBe("bekasi");
      expect(response.body.data.postal_code).toBe('17134');
    })
  })

  describe("GET /api/contacts/:contactId/addresses/:addressId", () => {
    beforeEach(async () => {
      await testService.deleteAddressess();
      await testService.deleteContact();
      await testService.deleteUser();

      await testService.createUser();
      await testService.createContact();
      await testService.createAddressess();
    })

    it("should be rejected if contact is not found", async () => {
      const contact = await testService.getContact()
      const address = await testService.getAdrress();
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id + 1}/addresses/${address.id}`)
        .set('Authorization', 'test')

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    })

    it("should be rejected if address is not found", async () => {
      const contact = await testService.getContact()
      const address = await testService.getAdrress();
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
        .set('Authorization', 'test')

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    })

    it("should be able get address", async () => {
      const contact = await testService.getContact()
      const address = await testService.getAdrress();
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id}/addresses/${address.id}`)
        .set('Authorization', 'test')

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.street).toBe("bekasi");
      expect(response.body.data.city).toBe("bekasi");
      expect(response.body.data.province).toBe("bekasi");
      expect(response.body.data.country).toBe("bekasi");
      expect(response.body.data.postal_code).toBe('17134');
    })
  })

  describe("PUT /api/contacts/:contactId/addresses/:addressId", () => {
    beforeEach(async () => {
      await testService.deleteAddressess();
      await testService.deleteContact();
      await testService.deleteUser();

      await testService.createUser();
      await testService.createContact();
      await testService.createAddressess()
    })

    it("should be rejected if request is invalid", async () => {
      const contact = await testService.getContact()
      const address = await testService.getAdrress()
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
        .set('Authorization', 'test')
        .send({
          street: '',
          city: '',
          provice: '',
          country: '',
          postal_code: ''
        })

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    })

    it("should be able update addresses", async () => {
      const contact = await testService.getContact()
      const address = await testService.getAdrress()
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
        .set('Authorization', 'test')
        .send({
          street: 'bekasi_update',
          city: 'bekasi_update',
          province: 'bekasi_update',
          country: 'bekasi_update',
          postal_code: '17134_1'
        })

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.street).toBe("bekasi_update");
      expect(response.body.data.city).toBe("bekasi_update");
      expect(response.body.data.province).toBe("bekasi_update");
      expect(response.body.data.country).toBe("bekasi_update");
      expect(response.body.data.postal_code).toBe('17134_1');
    })
  })

  describe("DELETE /api/contacts/:contactId/addresses/:addressId", () => {
    beforeEach(async () => {
      await testService.deleteAddressess();
      await testService.deleteContact();
      await testService.deleteUser();

      await testService.createUser();
      await testService.createContact();
      await testService.createAddressess();
    })

    it("should be rejected if contact is not found", async () => {
      const contact = await testService.getContact()
      const address = await testService.getAdrress();
      const response = await request(app.getHttpServer())
        .delete(`/api/contacts/${contact.id + 1}/addresses/${address.id}`)
        .set('Authorization', 'test')

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    })

    it("should be rejected if address is not found", async () => {
      const contact = await testService.getContact()
      const address = await testService.getAdrress();
      const response = await request(app.getHttpServer())
        .delete(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
        .set('Authorization', 'test')

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    })

    it("should be able delete address", async () => {
      const contact = await testService.getContact()
      const address = await testService.getAdrress();
      const response = await request(app.getHttpServer())
        .delete(`/api/contacts/${contact.id}/addresses/${address.id}`)
        .set('Authorization', 'test')

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data).toBe(true);
    })
  })
});
