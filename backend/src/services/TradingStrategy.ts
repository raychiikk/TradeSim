// src/services/TradingStrategy.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface ITradingStrategy {
    analyze(symbol: string, currentPrice: number): string;
}

export class MovingAverageStrategy implements ITradingStrategy {
    public analyze(symbol: string, currentPrice: number): string {
        return `[MovingAverage] Аналіз ${symbol}: ціна ${currentPrice} вище середньої. Рекомендація: пріоритет купівлі — вище середнього, але варто почекати перепроданості.`;
    }
}

export class RSIStrategy implements ITradingStrategy {
    public analyze(symbol: string, currentPrice: number): string {
        return `[RSI] Аналіз ${symbol}: RSI=30 (перепроданість). Рекомендація: пріоритет купівлі — дуже високий, варто брати.`;
    }
}

export class AutoTrader {
    private strategy: ITradingStrategy;
    private botName: string;

    constructor(strategy: ITradingStrategy, botName: string = "AlphaBot") {
        this.strategy = strategy;
        this.botName = botName;
    }

    // метод зберігає паттерн у базі даних
    public async setStrategy(strategy: ITradingStrategy): Promise<void> {
        this.strategy = strategy;
        const strategyName = strategy.constructor.name;
        console.log(`\n[Strategy] Бот ${this.botName} змінив алгоритм на: ${strategyName}`);

        try {
            await prisma.botConfig.upsert({
                where: { botName: this.botName },
                update: { strategy: strategyName },
                create: { botName: this.botName, strategy: strategyName }
            });
            console.log(`[Strategy] Стан бота збережено в PostgreSQL!`);
        } catch (error) {
            console.error(`[Strategy] Помилка збереження стану:`, error);
        }
    }

    public evaluateMarket(symbol: string, currentPrice: number): void {
        const decision = this.strategy.analyze(symbol, currentPrice);
        console.log(`[AutoTrader] Рішення: ${decision}`);
    }
}
