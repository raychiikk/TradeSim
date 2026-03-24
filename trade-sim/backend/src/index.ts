import express from 'express';
import type { Request, Response } from 'express';

import { OrderFactory } from './models/OrderFactory.ts';

const app = express();
const PORT = 3000;

// Базовий маршрут (Route) для перевірки працездатності
app.get('/', (req: Request, res: Response) => {
    res.send("TradeSim API is running");
});

// Запуск сервера та прослуховування порту
app.listen(PORT, () => {
    console.log(`Сервер TradeSim успішно запущено на порту ${PORT}!`);
    
    // === ТЕСТУВАННЯ ПАТЕРНУ FACTORY METHOD ===
    console.log('\n--- Симуляція створення ордерів ---');

    try {
        // 1. Створюємо ринковий ордер (market)
        const myFirstOrder = OrderFactory.createOrder({
            type: 'market',
            id: 'ord-001',
            symbol: 'BTC/USDT',
            side: 'buy',
            amount: 0.5
        });
        
        // Викликаємо метод виконання
        myFirstOrder.execute();

        // 2. Створюємо лімітний ордер (limit)
        const mySecondOrder = OrderFactory.createOrder({
            type: 'limit',
            id: 'ord-002',
            symbol: 'ETH/USDT',
            side: 'sell',
            amount: 10,
            targetPrice: 3500 // Специфічне поле
        });
        
        mySecondOrder.execute();

        // 3. Тестуємо захист Фабрики (розкоментуй наступні рядки, щоб побачити помилку)
        // const badOrder = OrderFactory.createOrder({
        //     type: 'limit',
        //     id: 'ord-003',
        //     symbol: 'SOL/USDT',
        //     side: 'buy',
        //     amount: 100
        //     // Забули вказати targetPrice!
        // });

    } catch (error) {
        console.error('Сталася помилка у Фабриці:', error);
    }
});