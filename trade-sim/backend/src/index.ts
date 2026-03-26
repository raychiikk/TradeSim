// src/index.ts
import express, { type Request, type Response } from 'express';
import { OrderFactory } from './models/OrderFactory.js';
import { TradeHistory } from './services/TradeHistory.js';

const app = express();
const PORT = 3000;

app.get('/', (req: Request, res: Response) => {
    res.send("TradeSim API is running");
});

app.listen(PORT, () => {
    console.log(`Сервер TradeSim успішно запущено на порту ${PORT}!\n`);
    
    console.log('--- Симуляція створення ордерів (Factory) та запису (Singleton) ---');

    try {
        // Отримуємо єдиний екземпляр історії торгів
        const history = TradeHistory.getInstance();

        // Створюємо та виконуємо перший ордер
        const myFirstOrder = OrderFactory.createOrder({
            type: 'market',
            id: 'ord-001',
            symbol: 'BTC/USDT',
            side: 'buy',
            amount: 0.5
        });
        myFirstOrder.execute();
        history.addOrder(myFirstOrder); // Зберігаємо в Singleton

        // Створюємо та виконуємо другий ордер
        const mySecondOrder = OrderFactory.createOrder({
            type: 'limit',
            id: 'ord-002',
            symbol: 'ETH/USDT',
            side: 'sell',
            amount: 10,
            targetPrice: 3500
        });
        mySecondOrder.execute();
        history.addOrder(mySecondOrder); // Зберігаємо в Singleton

        // Перевірка патерну Singleton: намагаємося отримати екземпляр знову
        const anotherHistoryReference = TradeHistory.getInstance();
        console.log(`\nПеревірка Singleton: чи співпадають об'єкти? -> ${history === anotherHistoryReference}`);
        console.log(`Кількість збережених ордерів у "новій" змінній: ${anotherHistoryReference.getOrders().length}`);

    } catch (error) {
        console.error('Сталася помилка:', error);
    }
});