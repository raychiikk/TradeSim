// src/services/PriceTicker.ts

// Інтерфейс для спостерігачів (тих, хто слухає оновлення)
export interface IPriceObserver {
    update(symbol: string, price: number): void;
}

export class PriceTicker {
    private observers: IPriceObserver[] = [];
    private prices: Map<string, number> = new Map();

    public attach(observer: IPriceObserver): void {
        this.observers.push(observer);
    }

    public detach(observer: IPriceObserver): void {
        const index = this.observers.indexOf(observer);
        if (index !== -1) {
            this.observers.splice(index, 1);
        }
    }

    public updatePrice(symbol: string, price: number): void {
        this.prices.set(symbol, price);
        this.notify(symbol, price);
    }

    private notify(symbol: string, price: number): void {
        for (const observer of this.observers) {
            observer.update(symbol, price);
        }
    }
}

// Конкретний спостерігач 1: Торговий бот
export class TradingBot implements IPriceObserver {
    private name: string;

    constructor(name: string) {
        this.name = name;
    }

    public update(symbol: string, price: number): void {
        console.log("[Бот " + this.name + "] Отримано нову ціну для " + symbol + ": " + price);
    }
}

// Конкретний спостерігач 2: Аналітичний дашборд
export class Dashboard implements IPriceObserver {
    public update(symbol: string, price: number): void {
        console.log("[Дашборд] Оновлення графіка " + symbol + " -> " + price);
    }
}