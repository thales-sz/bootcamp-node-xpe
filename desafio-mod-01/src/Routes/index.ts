import { log } from 'console';
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
    await fs.writeFile("pedidos.json", JSON.stringify(data, null, 2));
    res.status(201).json(newOrder);
  } catch (error) {
    next(error);
  }
})

router.patch('/update/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newOrder: IOrder = req.body;
    const { id } = req.params;
    const response = await fs.readFile("pedidos.json");
    const data: IFileOrders = JSON.parse(response.toString());
    if (data.pedidos.find((order) => order.id === Number(id))) {
      const newData = data.pedidos.map((order) => {
        if (order.id === Number(id)) {
          return order = {
            ...order,
            ...newOrder,
          }
        }
        return order;
      });
      data.pedidos = newData;
      await fs.writeFile("pedidos.json", JSON.stringify(data, null, 2));
      return res.status(202).json(newData);
    }
    return res.status(404).json({ message: "Invalid order" });
  } catch (error) {
    next(error);
  }
})

router.patch('/update/status/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { entregue } = req.body;
    const { id } = req.params;
    const response = await fs.readFile("pedidos.json");
    const data: IFileOrders = JSON.parse(response.toString());
    if (data.pedidos.find((order) => order.id === Number(id))) {
      const newData = data.pedidos.map((order) => {
        if (order.id === Number(id)) {
          return order = {
            ...order,
            entregue,
          }
        }
        return order;
      });
      data.pedidos = newData;
      await fs.writeFile("pedidos.json", JSON.stringify(data, null, 2));
      return res.status(202).json(newData);
    }
    return res.status(404).json({ message: "Invalid order" });
  } catch (error) {
    next(error);
  }
})

router.delete('/delete/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newOrder: IOrder = req.body;
    const { id } = req.params;
    const response = await fs.readFile("pedidos.json");
    const data: IFileOrders = JSON.parse(response.toString());
    if (data.pedidos.find((order) => order.id === Number(id))) {
      const newData = data.pedidos.filter((order) => order.id !== Number(id));
      data.pedidos = newData;
      await fs.writeFile("pedidos.json", JSON.stringify(data, null, 2));
      return res.status(202).json(newData);
    }
    return res.status(404).json({ message: "Invalid order" });
  } catch (error) {
    next(error);
  }
})

export default router;