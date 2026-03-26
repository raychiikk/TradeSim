// src/services/BacktestTemplate.ts

export abstract class BacktestRunner {
    
    public runBacktest(symbol: string): void {
        console.log(`\n[Backtest] Початок тестування для ${symbol}...`);
        this.loadHistoricalData(symbol);
        this.executeStrategy();
        this.calculateResults();
        console.log(`[Backtest] Тестування ${symbol} завершено.\n`);
    }

    protected abstract loadHistoricalData(symbol: string): void;

    protected abstract executeStrategy(): void;

    protected calculateResults(): void {
        console.log(`[Backtest] Базовий розрахунок: PnL (Прибуток/Збиток) збережено у звіт.`);
    }
}

export class CryptoBacktest extends BacktestRunner {
    protected loadHistoricalData(symbol: string): void {
        console.log(`[CryptoBacktest] Підключення до Binance API... Завантаження свічок для ${symbol}.`);
    }

    protected executeStrategy(): void {
        console.log(`[CryptoBacktest] Запуск високочастотного торгового бота (HFT) на історичних даних.`);
    }
}

export class ForexBacktest extends BacktestRunner {
    protected loadHistoricalData(symbol: string): void {
        console.log(`[ForexBacktest] Читання CSV-файлу з локального диска для валютної пари ${symbol}.`);
    }

    protected executeStrategy(): void {
        console.log(`[ForexBacktest] Запуск стратегії слідування за трендом (Trend Following).`);
    }
    
    protected calculateResults(): void {
        super.calculateResults();
        console.log(`[ForexBacktest] Додатковий розрахунок: враховано свопи (swaps) та спреди брокера.`);
    }
}