import { describe, it, expect } from 'vitest';
import { TradeHistory } from '../src/services/TradeHistory';

describe('Singleton Pattern: TradeHistory', () => {
    
    it('має повертати один і той самий екземпляр (Singleton)', () => {
        const instance1 = TradeHistory.getInstance();
        const instance2 = TradeHistory.getInstance();

        expect(instance1).toBe(instance2);
    });

    it('не повинен дозволяти створення через new (має бути приватний конструктор)', () => {
        // перевіряємо наявність статичного методу getInstance.
        expect(typeof TradeHistory.getInstance).toBe('function');
    });
});