import { describe, it, expect } from 'vitest';
import { OrderFactory } from '../src/models/OrderFactory'; 

describe('Pattern: Factory Method (OrderFactory)', () => {
    
    it('повинен успішно створювати MarketOrder (ринковий ордер)', () => {
        const testData = { type: 'market', id: 'ord-001', symbol: 'BTC/USDT', side: 'buy', amount: 0.5 };
        const order = OrderFactory.createOrder(testData);

        expect(order).toBeDefined();
        expect(order.symbol).toBe('BTC/USDT');
        expect(order.side).toBe('buy');
        expect(order.amount).toBe(0.5);
    });

    it('повинен успішно створювати LimitOrder (лімітний ордер)', () => {
        const testData = { type: 'limit', id: 'ord-002', symbol: 'ETH/USDT', side: 'sell', amount: 10, targetPrice: 3500 };
        const order = OrderFactory.createOrder(testData) as any; 
        // as any використовуємо чисто для тесту, щоб швидко дістати специфічні поля, якщо вони є

        expect(order).toBeDefined();
        expect(order.symbol).toBe('ETH/USDT');
        expect(order.amount).toBe(10);
    });

    it('повинен викидати помилку, якщо не вказано тип ордера', () => {
        const invalidData = { id: 'ord-003', symbol: 'SOL/USDT' }; // немає поля type
        
        expect(() => OrderFactory.createOrder(invalidData)).toThrowError("Помилка: Не вказано тип ордера.");
    });

    it('повинен викидати помилку для лімітного ордера без targetPrice', () => {
        const invalidLimitData = { type: 'limit', id: 'ord-004', symbol: 'DOGE/USDT', side: 'buy', amount: 1000 }; 
        
        expect(() => OrderFactory.createOrder(invalidLimitData)).toThrowError("Помилка: Для лімітного ордера обов'язково потрібна ціна (targetPrice).");
    });

    it('повинен викидати помилку для невідомого типу ордера', () => {
        const unknownTypeData = { type: 'stop-loss', id: 'ord-005', symbol: 'BNB/USDT', side: 'sell', amount: 2 };
        
        expect(() => OrderFactory.createOrder(unknownTypeData)).toThrowError("Помилка: Невідомий тип ордера 'stop-loss'.");
    });
});