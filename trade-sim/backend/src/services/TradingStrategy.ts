// src/services/TradingStrategy.ts

export interface ITradingStrategy {
    analyze(symbol: string, currentPrice: number): 'buy' | 'sell' | 'hold';
}

export class MovingAverageStrategy implements ITradingStrategy {
    public analyze(symbol: string, currentPrice: number): 'buy' | 'sell' | 'hold' {
        console.log(`[Стратегія] Аналіз ${symbol} алгоритмом Moving Average...`);

        if (currentPrice < 50000) return 'buy';
        if (currentPrice > 60000) return 'sell';
        return 'hold';
    }
}


export class RSIStrategy implements ITradingStrategy {
    public analyze(symbol: string, currentPrice: number): 'buy' | 'sell' | 'hold' {
        console.log(`[Стратегія] Аналіз ${symbol} алгоритмом RSI (Relative Strength Index)...`);
        // Інша логіка для того ж самого активу
        if (currentPrice < 30000) return 'buy';
        return 'sell';
    }
}

// Автоматичний трейдер, який використовує стратегію
export class AutoTrader {
    private strategy: ITradingStrategy;

    constructor(strategy: ITradingStrategy) {
        this.strategy = strategy;
    }

    // Метод для динамічної зміни стратегії "на льоту"
    public setStrategy(strategy: ITradingStrategy): void {
        console.log(`[AutoTrader] Зміна торгової стратегії...`);
        this.strategy = strategy;
    }

    // Виконання логіки обраної стратегії
    public evaluateMarket(symbol: string, currentPrice: number): void {
        const decision = this.strategy.analyze(symbol, currentPrice);
        console.log(`[AutoTrader] Рішення для ${symbol}: ${decision.toUpperCase()}\n`);
    }
}