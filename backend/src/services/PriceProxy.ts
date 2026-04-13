/**
 * Загальний інтерфейс для сервісів отримання ціни.
 * @interface IPriceProvider
 */
export interface IPriceProvider {
    /**
     * Отримує поточну ціну для заданого інструменту.
     * @param {string} symbol - Торгова пара (наприклад, 'BTC/USDT').
     * @returns {number} Поточна ціна.
     */
    getPrice(symbol: string): number;
}

/**
 * Імітація реального API біржі, що робить "повільні" мережеві запити.
 * @class RealPriceAPI
 * @implements {IPriceProvider}
 */
export class RealPriceAPI implements IPriceProvider {
    public getPrice(symbol: string): number {
        console.log(`[RealAPI] Мережевий запит до біржі для отримання ціни ${symbol}...`);
        return symbol === 'BTC/USDT' ? 65000 : 3500; 
    }
}

/**
 * Кешуючий проксі для отримання цін.
 * @class CachedPriceProxy
 * @implements {IPriceProvider}
 * @description Реалізує структурний патерн **Proxy** (Замісник).
 * Перехоплює запити до реального API, зберігає результати в пам'яті (кеші) 
 * на 5 секунд і повертає їх при повторних запитах, заощаджуючи ресурси системи.
 */
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