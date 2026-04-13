import { type IOrder, MarketOrder, LimitOrder } from './Orders.js';

/**
 * Фабрика для створення торгових ордерів.
 * @class OrderFactory
 * @description Реалізує патерн проєктування **Factory Method**.
 * Відповідає за інкапсуляцію логіки створення об'єктів типу MarketOrder та LimitOrder.
 */
export class OrderFactory {
    /**
     * Створює новий торговий ордер на основі вхідних даних.
     * * @param {any} data - Об'єкт з параметрами ордера (тип, ціна, кількість).
     * @returns {IOrder} Новий екземпляр ордера.
     * @throws {Error} Якщо не вказано тип ордера або відсутня ціна для лімітного ордера.
     */
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