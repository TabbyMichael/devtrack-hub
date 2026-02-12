import { Test } from "@nestjs/testing";
import { INestApplication, VersioningType } from "@nestjs/common";
import { AppModule } from "../src/app.module";
import * as request from "supertest";
import { HttpExceptionFilter } from "../src/common/filters/http-exception.filter";
import { LoggingInterceptor } from "../src/common/interceptors/logging.interceptor";

describe("Auth (e2e)", () => {
  let app: INestApplication;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();
    app = moduleRef.createNestApplication();
    app.enableVersioning({ type: VersioningType.URI });
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new LoggingInterceptor());
    await app.init();
  });
  afterAll(async () => {
    await app.close();
  });
  it("/v1/auth/health (GET)", async () => {
    await request(app.getHttpServer()).get("/v1/auth/health").expect(200).expect({ ok: true });
  });
});
