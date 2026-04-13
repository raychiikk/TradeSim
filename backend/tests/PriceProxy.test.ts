// backend/tests/PriceProxy.test.ts
import { describe, it, expect, vi } from 'vitest';
import { RealPriceAPI, CachedPriceProxy } from '../src/services/PriceProxy';

describe('Pattern: Proxy', () => {
    it('CachedPriceProxy має викликати RealPriceAPI при першому запиті', () => {
        const realAPI = new RealPriceAPI();

        const getPriceSpy = vi.spyOn(realAPI, 'getPrice');
        const proxy = new CachedPriceProxy(realAPI);

        const price = proxy.getPrice('BTC/USDT');
        
        expect(price).toBe(65000);
        expect(getPriceSpy).toHaveBeenCalledTimes(1);
        expect(getPriceSpy).toHaveBeenCalledWith('BTC/USDT');
    });

    it('CachedPriceProxy має повертати закешоване значення при повторних запитах (без виклику RealAPI)', () => {
        const realAPI = new RealPriceAPI();
        const getPriceSpy = vi.spyOn(realAPI, 'getPrice');
        const proxy = new CachedPriceProxy(realAPI);


        proxy.getPrice('BTC/USDT');

        proxy.getPrice('BTC/USDT');

        proxy.getPrice('BTC/USDT');

        expect(getPriceSpy).toHaveBeenCalledTimes(1);
    });
});