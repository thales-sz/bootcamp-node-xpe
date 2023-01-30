import express, { NextFunction, Request, Response } from 'express';
import fs from 'fs/promises';
import IOrder, { IFileOrders } from '../Interfaces/Order.interface';

const router = express.Router();

router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await fs.readFile("pedidos.json");
    const data: IFileOrders = JSON.parse(response.toString());
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

router.post('/create', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newOrder: IOrder = req.body;
    newOrder.timestamp = new Date();
    newOrder.entregue = false;
    const response = await fs.readFile("pedidos.json");
    const data: IFileOrders = JSON.parse(response.toString());
    newOrder.id = data.nextId;
    data.nextId += 1;
    data.pedidos.push(newOrder);
    res.status(201).json(newOrder);
  } catch (error) {
    next(error);
  }
})

export default router;