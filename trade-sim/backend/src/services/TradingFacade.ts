// src/services/TradingFacade.ts
import { OrderFactory } from '../models/OrderFactory.js';
import { FeeOrderDecorator } from '../models/OrderDecorator.js';
import { TradingTerminal, PlaceOrderCommand } from './Command.js';
import { TradeHistory } from './TradeHistory.js';

export class TradingFacade {
    private terminal: TradingTerminal;
    private history: TradeHistory;

    constructor() {
        this.terminal = new TradingTerminal();
        this.history = TradeHistory.getInstance();
    }

    // Єдиний простий метод для клієнта, який ховає в собі 4 інших патерни
    public placeMarketOrderWithFee(symbol: string, side: 'buy' | 'sell', amount: number): void {
        console.log(`\n[Facade] Отримано запит на швидке розміщення ордера: ${side} ${amount} ${symbol}`);
        
        // Factory
        const baseOrder = OrderFactory.createOrder({
            type: 'market',
            id: `ord-${Date.now()}`, // Генеруємо унікальний ID на основі часу
            symbol: symbol,
            side: side,
            amount: amount
        });

        // Decorator
        const orderWithFee = new FeeOrderDecorator(baseOrder);

        // Command
        const command = new PlaceOrderCommand(orderWithFee, this.history);

        this.terminal.executeCommand(command);
    }
    
    // скасування
    public undoLastOperation(): void {
        this.terminal.undoLastCommand();
    }
}