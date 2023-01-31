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

router.get('/total/client', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cliente } = req.body;
    const response = await fs.readFile("pedidos.json");
    const data: IFileOrders = JSON.parse(response.toString());
    const value = data.pedidos.reduce((acc, order, i) => {
      if (order.cliente === cliente && order.entregue) {
        return acc += order.valor;
      }
      return acc;
    }, 0)
    return res.status(200).json({ value })
  } catch (error) {
    next(error);
  }
})

router.get('/total/product', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { produto } = req.body;
    const response = await fs.readFile("pedidos.json");
    const data: IFileOrders = JSON.parse(response.toString());
    const value = data.pedidos.reduce((acc, order, i) => {
      if (order.produto === produto && order.entregue) {
        return acc += order.valor;
      }
      return acc;
    }, 0)
    return res.status(200).json({ value })
  } catch (error) {
    next(error);
  }
})

router.get('/most-sold', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await fs.readFile("pedidos.json");
    const data: IFileOrders = JSON.parse(response.toString());
    const mostSold: any = {};
    data.pedidos.forEach((order) => {
      if (order.entregue) return mostSold[order.produto] = (mostSold[order.produto] || 0) + 1
    });
    return res.status(200).json(mostSold);
  } catch (error) {
    next(error);
  }
})

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const response = await fs.readFile("pedidos.json");
    const data: IFileOrders = JSON.parse(response.toString());
    const order = data.pedidos.find((order) => order.id === Number(id));
    return order ? res.status(200).json(order) : res.status(404).json({ message: "User not found" });
  } catch (error) {
    next(error);
  }
})

export default router;