// src/services/Command.ts
import { type IOrder } from '../models/Orders.js';
import { TradeHistory } from './TradeHistory.js';

export interface ICommand {
    execute(): void;
    undo(): void;
}

export class PlaceOrderCommand implements ICommand {
    private order: IOrder;
    private history: TradeHistory;

    constructor(order: IOrder, history: TradeHistory) {
        this.order = order;
        this.history = history;
    }

    public execute(): void {
        console.log(`[Command] Виконання команди: Розміщення ордера ${this.order.id}`);
        this.order.execute();
        this.history.addOrder(this.order);
    }

    public undo(): void {
        console.log(`[Command] Скасування команди (UNDO): Відміна ордера ${this.order.id}`);
    }
}

export class TradingTerminal {
    private commandHistory: ICommand[] = [];

    public executeCommand(command: ICommand): void {
        command.execute();
        this.commandHistory.push(command);
    }

    public undoLastCommand(): void {
        const lastCommand = this.commandHistory.pop();
        if (lastCommand) {
            console.log("\n[Terminal] Ініційовано скасування останньої дії...");
            lastCommand.undo();
        } else {
            console.log("[Terminal] Немає команд для скасування.");
        }
    }
}