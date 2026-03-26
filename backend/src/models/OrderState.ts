// src/models/OrderState.ts

export interface IOrderState {
    fill(order: TradeOrder): void;
    cancel(order: TradeOrder): void;
}

// сам ордер, який змінює свої стани
export class TradeOrder {
    private state: IOrderState;

    constructor(public id: string, public symbol: string, public amount: number) {
        this.state = new PendingState();
    }

    public setState(state: IOrderState): void {
        this.state = state;
    }

    public fill(): void {
        this.state.fill(this);
    }

    public cancel(): void {
        this.state.cancel(this);
    }
}

export class PendingState implements IOrderState {
    public fill(order: TradeOrder): void {
        console.log(`[State] Ордер ${order.id} успішно виконано (Filled).`);
        order.setState(new FilledState());
    }

    public cancel(order: TradeOrder): void {
        console.log(`[State] Ордер ${order.id} успішно скасовано (Canceled).`);
        order.setState(new CanceledState());
    }
}

export class FilledState implements IOrderState {
    public fill(order: TradeOrder): void {
        console.log(`[State] Відмова: Ордер ${order.id} вже був виконаний раніше.`);
    }

    public cancel(order: TradeOrder): void {
        console.log(`[State] Відмова: Ордер ${order.id} вже виконаний, його неможливо скасувати.`);
    }
}

export class CanceledState implements IOrderState {
    public fill(order: TradeOrder): void {
        console.log(`[State] Відмова: Ордер ${order.id} був скасований, виконання неможливе.`);
    }

    public cancel(order: TradeOrder): void {
        console.log(`[State] Відмова: Ордер ${order.id} вже знаходиться у стані скасування.`);
    }
}