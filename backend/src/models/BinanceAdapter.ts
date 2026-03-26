// src/models/BinanceAdapter.ts
import { type IOrder } from './Orders.js';

// 1. Несумісний інтерфейс (так приходять дані від зовнішньої біржі, наприклад Binance)
export interface IBinanceOrder {
    symbol_name: string; // Формат "BTCUSDT" замість нашого "BTC/USDT"
    action: 'BUY' | 'SELL'; // Великий регістр
    volume: number; // Називається volume замість amount
}

// 2. Клас-Адаптер, який перетворює чужий формат на наш стандартний IOrder
export class BinanceOrderAdapter implements IOrder {
    public id: string;
    public symbol: string;
    public side: 'buy' | 'sell';
    public amount: number;

    constructor(private binanceOrder: IBinanceOrder) {

        this.id = 'binance-' + Math.floor(Math.random() * 10000);
        
        this.symbol = this.binanceOrder.symbol_name.replace('USDT', '/USDT');
        
        this.side = this.binanceOrder.action.toLowerCase() as 'buy' | 'sell';

        this.amount = this.binanceOrder.volume;
    }

    // Реалізуємо обов'язковий метод нашого інтерфейсу
    execute(): void {
        console.log(`[Adapter] Виконання адаптованого ордера з Binance: ${this.side} ${this.amount} ${this.symbol}`);
    }
}