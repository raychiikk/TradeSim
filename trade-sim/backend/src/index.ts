import express from 'express';
import type { Request, Response } from 'express';

const app = express();
const PORT = 3000;

// Базовий маршрут (Route) для перевірки працездатності
app.get('/', (req: Request, res: Response) => {
    res.send("TradeSim API is running");
});

// Запуск сервера та прослуховування порту
app.listen(PORT, () => {
    console.log(`Сервер TradeSim успішно запущено на порту ${PORT}!`);
});