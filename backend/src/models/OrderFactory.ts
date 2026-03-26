// src/models/OrderFactory.ts
import { type IOrder, MarketOrder, LimitOrder } from './Orders.js';

export class OrderFactory {
    // Статичний метод дозволяє викликати фабрику без створення її екземпляра (через new OrderFactory)
    static createOrder(data: any): IOrder {
        if (!data.type) {
            throw new Error("Помилка: Не вказано тип ордера.");
        }

        switch (data.type) {
            case 'market':
                return new MarketOrder(data.id, data.symbol, data.side, data.amount);
            
            case 'limit':
                if (!data.targetPrice) {
                    throw new Error("Помилка: Для лімітного ордера обов'язково потрібна ціна (targetPrice).");
                }
                return new LimitOrder(data.id, data.symbol, data.side, data.amount, data.targetPrice);
            
            default:
                throw new Error(`Помилка: Невідомий тип ордера '${data.type}'.`);
        }
    }
}