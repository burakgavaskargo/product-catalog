import supertest from 'supertest';
import { createServer, Server } from 'http';
import { Express } from 'express';
import appInit from '../../../src/app';
import { Product } from '../../../src/types/product';


// TODO: consider making a db call instead of firing up the whole app
export default async function getFirstPageOfProducts(): Promise<Product[]> {

  const app: Express = await appInit();

  try {
    const server: Server = createServer(app);
    const req = supertest(server);
    const url = '/api/products/0';
    const res = await req.get(url);
    if(res.status !== 200) {
      throw new Error(`failed to get ${url}: status ${res.status}`);
    }
    const products = res.body as Product[] | undefined;
    if (!products || !products.length) {
      throw new Error(`failed to get products from ${url}`);
    }

    return products;

  } finally {
    const db = app?.locals?.db;
    if (db) {
      await db.end();
    }
  }
}