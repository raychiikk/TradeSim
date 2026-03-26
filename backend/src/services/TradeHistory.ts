// src/services/TradeHistory.ts
import { type IOrder } from '../models/Orders.js';

export class TradeHistory {

    private static instance: TradeHistory;

    private orders: IOrder[] = [];

    private constructor() {}

    public static getInstance(): TradeHistory {
        if (!TradeHistory.instance) {
            TradeHistory.instance = new TradeHistory();
        }
        return TradeHistory.instance;
    }

    public addOrder(order: IOrder): void {
        this.orders.push(order);
        console.log(`[TradeHistory] Ордер ${order.id} додано до історії. Всього ордерів: ${this.orders.length}`);
    }

    public getOrders(): IOrder[] {
        return this.orders;
    }
}