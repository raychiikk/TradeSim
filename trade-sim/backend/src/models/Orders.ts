// src/models/Order.ts

// Загальний інтерфейс, який гарантує, що всі ордери матимуть базовий набір властивостей та метод execute()
export interface IOrder {
    id: string;
    symbol: string;
    side: 'buy' | 'sell';
    amount: number;
    execute(): void;
}

// Клас ринкового ордера (виконується миттєво)
export class MarketOrder implements IOrder {
    // Використання модифікатора public у конструкторі автоматично створює властивості класу і присвоює їм значення
    constructor(
        public id: string,
        public symbol: string,
        public side: 'buy' | 'sell',
        public amount: number
    ) {}

    execute(): void {
        console.log(`[MarketOrder] Виконання ринкового ордера: ${this.side} ${this.amount} ${this.symbol} за поточною ціною.`);
    }
}

// Клас лімітного ордера (чекає заданої ціни)
export class LimitOrder implements IOrder {
    constructor(
        public id: string,
        public symbol: string,
        public side: 'buy' | 'sell',
        public amount: number,
        public targetPrice: number 
    ) {}

    execute(): void {
        console.log(`[LimitOrder] Лімітний ордер додано в стакан: ${this.side} ${this.amount} ${this.symbol}. Чекаємо ціну ${this.targetPrice}.`);
    }
}