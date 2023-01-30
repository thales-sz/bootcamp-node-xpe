export default interface IOrder {
  id?: number;
  cliente: string;
  produto: string;
  valor: number;
  entregue: boolean;
  timestamp: Date; 
}

export interface IFileOrders {
  nextId: number;
  pedidos: Array<IOrder>;
}