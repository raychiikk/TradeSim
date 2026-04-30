import { describe, it, expect } from 'vitest';
import { BacktestService } from '../src/services/BacktestService';

describe('BacktestService (Мультипоточність - Лаба №3)', () => {
    const service = new BacktestService();

    it('повинен генерувати масив мок-даних правильного розміру', () => {
        const size = 5000;
        const data = service.generateMockData(size);
        expect(data.length).toBe(size);
        expect(typeof data[0]).toBe('number');
    });

    it('результати (profit та trades) послідовного і паралельного виконання мають бути дуже близькими', async () => {
        const mockData = service.generateMockData(10000);
        const threadsCount = 4;
        
        const seqResult = service.runSequential(mockData);
        const parResult = await service.runParallel(mockData, threadsCount);

        const profitDifference = Math.abs(parResult.profit - seqResult.profit);
        expect(profitDifference).toBeLessThan(50); 
        
        const tradesDifference = Math.abs(parResult.trades - seqResult.trades);
        expect(tradesDifference).toBeLessThanOrEqual(threadsCount);
    });

    it('паралельне виконання має успішно обробляти неправильні дані (порожній масив)', async () => {
        const seqResult = service.runSequential([]);
        const parResult = await service.runParallel([], 4);

        expect(seqResult.profit).toBe(0);
        expect(parResult.profit).toBe(0);
        expect(seqResult.trades).toBe(0);
        expect(parResult.trades).toBe(0);
    });
});