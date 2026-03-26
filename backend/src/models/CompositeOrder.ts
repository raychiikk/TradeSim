// src/models/CompositeOrder.ts
import { type IOrder } from './Orders.js';

export class OrderGroup implements IOrder {
    public id: string;
    public symbol: string;
    public side: 'buy' | 'sell';
    public amount: number = 0; 
    
    private orders: IOrder[] = [];

    constructor(id: string, symbol: string, side: 'buy' | 'sell') {
        this.id = id;
        this.symbol = symbol;
        this.side = side;
    }

    public add(order: IOrder): void {
        this.orders.push(order);
        this.amount += order.amount; 
    }

    public execute(): void {
        console.log(`\n[Composite] Виконання групи ордерів ${this.id} (${this.orders.length} шт., загальний об'єм: ${this.amount}):`);
        for (const order of this.orders) {
            order.execute();
        }
        console.log(`[Composite] Групу ${this.id} успішно виконано.`);
    }
}