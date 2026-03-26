// src/models/OrderDecorator.ts
import { type IOrder } from './Orders.js';

export class OrderDecorator implements IOrder {
    public id: string;
    public symbol: string;
    public side: 'buy' | 'sell';
    public amount: number;

    protected wrappee: IOrder; // посилання на оригінальний ордер

    constructor(order: IOrder) {
        this.wrappee = order;

        this.id = order.id;
        this.symbol = order.symbol;
        this.side = order.side;
        this.amount = order.amount;
    }

    public execute(): void {
        this.wrappee.execute();
    }
}

export class FeeOrderDecorator extends OrderDecorator {
    private feePercentage: number = 0.001; // 0.1% комісія

    public execute(): void {
        const fee = this.amount * this.feePercentage;
        console.log("[Decorator] Утримано комісію біржі: " + fee + " " + this.symbol.split('/')[0]);

        super.execute();
    }
}

export class AuditLoggingDecorator extends OrderDecorator {
    public execute(): void {
        console.log("[Audit] АУДИТ-ЛОГ: Спроба виконання ордера " + this.id + " об " + new Date().toISOString());
        
        super.execute(); // виконання всіх попередніх обгорток та самого ордера
        
        console.log("[Audit] АУДИТ-ЛОГ: Ордер " + this.id + " успішно оброблено.");
    }
}