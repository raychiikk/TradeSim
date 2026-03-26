// src/index.ts
import express, { type Request, type Response } from 'express';

import { OrderFactory } from './models/OrderFactory.js';
import { TradeHistory } from './services/TradeHistory.js';
import { BinanceOrderAdapter, type IBinanceOrder } from './models/BinanceAdapter.js';
import { OrderGroup } from './models/CompositeOrder.js';
import { RealPriceAPI, CachedPriceProxy } from './services/PriceProxy.js';
import { PriceTicker, TradingBot, Dashboard } from './services/PriceTicker.js';
import { MovingAverageStrategy, RSIStrategy, AutoTrader } from './services/TradingStrategy.js';
import { TradeOrder } from './models/OrderState.js';
import { CryptoBacktest, ForexBacktest } from './services/BacktestTemplate.js';
import { TradingFacade } from './services/TradingFacade.js';

const app = express();
const PORT = 3000;

app.get('/', (req: Request, res: Response) => {
    res.send("TradeSim API is running with all 12 patterns!");
});

app.listen(PORT, () => {
    console.log(`\n Сервер TradeSim запущено на порту ${PORT}!`);
    console.log("===================================================\n");
    
    try {
        // 1. SINGLETON
        console.log("1. SINGLETON ");
        const history = TradeHistory.getInstance();
        console.log("[TradeHistory] Глобальне сховище ініціалізовано.\n");

        // 2. FACTORY METHOD (Фабрика) 
        console.log("2. FACTORY METHOD ");
        const btcOrder = OrderFactory.createOrder({ type: 'market', id: 'ord-001', symbol: 'BTC/USDT', side: 'buy', amount: 0.1 });
        btcOrder.execute();
        history.addOrder(btcOrder);
        console.log("");

        // 3. ADAPTER (Адаптер) 
        console.log("3. ADAPTER ");
        const externalData: IBinanceOrder = { symbol_name: "SOLUSDT", action: "SELL", volume: 15 };
        const adaptedOrder = new BinanceOrderAdapter(externalData);
        adaptedOrder.execute();
        history.addOrder(adaptedOrder);
        console.log("");

        // 4. COMPOSITE (Компонувальник) 
        console.log("4. COMPOSITE ");
        const gridOrder = new OrderGroup("grid-001", "ETH/USDT", "buy");
        gridOrder.add(OrderFactory.createOrder({ type: 'market', id: 'part-1', symbol: 'ETH/USDT', side: 'buy', amount: 1 }));
        gridOrder.add(OrderFactory.createOrder({ type: 'market', id: 'part-2', symbol: 'ETH/USDT', side: 'buy', amount: 2 }));
        gridOrder.execute();
        console.log("");

        // 5. PROXY (Замісник)
        console.log("5. PROXY ");
        const priceProxy = new CachedPriceProxy(new RealPriceAPI());
        priceProxy.getPrice("BTC/USDT"); // Реальний запит
        priceProxy.getPrice("BTC/USDT"); // Береться з кешу
        console.log("");

        // 6. OBSERVER (Спостерігач) 
        console.log("6. OBSERVER ");
        const ticker = new PriceTicker();
        ticker.attach(new TradingBot("Alpha"));
        ticker.attach(new Dashboard());
        ticker.updatePrice("BTC/USDT", 66000); // Сповістить усіх підписників
        console.log("");

        // 7. STRATEGY (Стратегія) 
        console.log("7. STRATEGY ");
        const trader = new AutoTrader(new MovingAverageStrategy());
        trader.evaluateMarket("ETH/USDT", 3400);
        trader.setStrategy(new RSIStrategy()); // Зміна алгоритму на льоту
        trader.evaluateMarket("ETH/USDT", 3400);

        // 8. STATE (Стан)
        console.log("8. STATE ");
        const lifecycleOrder = new TradeOrder("ord-state-99", "ADA/USDT", 1000);
        lifecycleOrder.fill();   // Успішно виконається
        lifecycleOrder.cancel(); // Заблокується, бо вже виконаний
        console.log("");

        // 9. TEMPLATE METHOD (Шаблонний метод) 
        console.log("9. TEMPLATE METHOD ");
        const cryptoRunner = new CryptoBacktest();
        cryptoRunner.runBacktest("BTC/USDT");
        console.log("");

        // 10, 11, 12. FACADE + DECORATOR + COMMAND 

        console.log("10, 11, 12. FACADE (використовує DECORATOR та COMMAND) ");
        const facade = new TradingFacade();
        
        facade.placeMarketOrderWithFee("DOGE/USDT", "buy", 500);
        
        facade.undoLastOperation();

        console.log("\n===================================================");
        console.log("Всі 12 патернів успішно відпрацювали!");

    } catch (error) {
        console.error("\nСталася помилка під час симуляції:", error);
    }
});