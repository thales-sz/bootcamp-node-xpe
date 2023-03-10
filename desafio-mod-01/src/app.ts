import express from 'express';
import DeliveryRouter from './Routes';

const app = express();

app.use(express.json());

app.use('/order', DeliveryRouter);

export default app;