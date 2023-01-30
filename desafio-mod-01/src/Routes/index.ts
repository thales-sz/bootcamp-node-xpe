import express, { NextFunction, Request, Response } from 'express';
import fs from 'fs/promises';

const router = express.Router();

router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await fs.readFile("pedidos.json")
    const data = JSON.parse(response.toString())
    res.status(200).json(data);
  } catch (error) {
    next(error)
  }
});

router.post('/newOrder', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    
  } catch (error) {
    next(error)
  }
})

export default router;