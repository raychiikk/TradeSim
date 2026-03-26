// src/services/PriceProxy.ts

export interface IPriceProvider {
    getPrice(symbol: string): number;
}

export class RealPriceAPI implements IPriceProvider {
    public getPrice(symbol: string): number {
        console.log(`[RealAPI] Мережевий запит до біржі для отримання ціни ${symbol}...`);
        // Імітація отримання реальної ціни
        return symbol === 'BTC/USDT' ? 65000 : 3500; 
    }
}

export class CachedPriceProxy implements IPriceProvider {
    private realAPI: RealPriceAPI;
    private cache: Map<string, { price: number, timestamp: number }> = new Map();
    private readonly CACHE_TTL_MS = 5000; 

    constructor(realAPI: RealPriceAPI) {
        this.realAPI = realAPI;
    }

    public getPrice(symbol: string): number {
        const cachedData = this.cache.get(symbol);
        const now = Date.now();

        if (cachedData && (now - cachedData.timestamp < this.CACHE_TTL_MS)) {
            console.log(`[Proxy] Повернення ЗАКЕШОВАНОЇ ціни для ${symbol} (заощаджено мережевий запит).`);
            return cachedData.price;
        }

        const newPrice = this.realAPI.getPrice(symbol);
        this.cache.set(symbol, { price: newPrice, timestamp: now });
        return newPrice;
    }
}