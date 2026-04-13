// backend/src/services/TradeHistory.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class TradeHistory {
    private static instance: TradeHistory;

    private constructor() {}

    public static getInstance(): TradeHistory {
        if (!TradeHistory.instance) {
            TradeHistory.instance = new TradeHistory();
        }
        return TradeHistory.instance;
    }

    public async addOrder(order: any): Promise<void> {
        try {
            await prisma.order.create({
                data: {
                    orderId: order.id || `ord-${Math.floor(Math.random() * 1000)}`,
                    symbol: order.symbol || "BTC/USDT",
                    side: order.side || "buy",
                    amount: order.amount || 0,
                    type: order.type || "market", 
                }
            });
            console.log(`[TradeHistory] Ордер ${order.id} успішно записано в базу!`);
        } catch (error) {
            console.error(`[TradeHistory] Помилка запису в БД:`, error);
        }
    }

    public async getAllOrders() {
        return await prisma.order.findMany({
            orderBy: { createdAt: 'desc' }
        });
    }
}