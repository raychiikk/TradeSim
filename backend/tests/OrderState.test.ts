// backend/tests/OrderState.test.ts
import { describe, it, expect } from 'vitest';
import { TradeOrder, PendingState, FilledState, CanceledState } from '../src/models/OrderState';

describe('Pattern: State', () => {
    it('Ордер повинен ініціалізуватися зі станом PendingState', () => {
        const order = new TradeOrder('1', 'BTC/USDT', 1.5);
        expect((order as any).state).toBeInstanceOf(PendingState);
    });

    it('Ордер має переходити в FilledState після виклику fill()', () => {
        const order = new TradeOrder('2', 'ETH/USDT', 10);
        order.fill();
        expect((order as any).state).toBeInstanceOf(FilledState);
    });

    it('Ордер має переходити в CanceledState після виклику cancel() з початкового стану', () => {
        const order = new TradeOrder('3', 'SOL/USDT', 50);
        order.cancel();
        expect((order as any).state).toBeInstanceOf(CanceledState);
    });

    it('Виконаний ордер (FilledState) не повинен змінювати стан при спробі скасування', () => {
        const order = new TradeOrder('4', 'DOGE/USDT', 1000);
        order.fill();
        order.cancel(); 
        
        expect((order as any).state).toBeInstanceOf(FilledState);
    });
});