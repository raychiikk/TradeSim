import { Worker } from 'worker_threads';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class BacktestService {
    public generateMockData(size: number): number[] {
        const data = new Float64Array(size); 
        let currentPrice = 50000; 
        for (let i = 0; i < size; i++) {
            currentPrice += (Math.random() - 0.5) * 10; 
            data[i] = currentPrice;
        }
        return Array.from(data);
    }

    public runSequential(prices: number[]): { duration: number, profit: number, trades: number } {
        const start = performance.now();
        
        let profit = 0;
        let tradesExecuted = 0;
        let position = 0;

        for (let i = 100; i < prices.length; i++) {
            const currentPrice = prices[i]!; 
            let indicatorValue = 0;
            for (let j = 1; j <= 100; j++) {
                const prevPrice = prices[i - j]!; 
                indicatorValue += Math.sqrt(currentPrice) * Math.sin(prevPrice) / Math.log(currentPrice + j);
            }

            if (indicatorValue > 15 && position === 0) {
                position = currentPrice; 
                tradesExecuted++;
            } else if (indicatorValue < -15 && position > 0) {
                profit += (currentPrice - position); 
                position = 0;
                tradesExecuted++;
            }
        }

        const end = performance.now();
        return { duration: end - start, profit, trades: tradesExecuted };
    }

    public async runParallel(prices: number[], threadsCount: number): Promise<{ duration: number, profit: number, trades: number }> {
        const start = performance.now();
        const chunkSize = Math.ceil(prices.length / threadsCount);
        
        const workerPath = path.resolve(__dirname, '../workers/backtest.worker.ts');
        
        const workers: Promise<{ profit: number, tradesExecuted: number }>[] = [];

        for (let i = 0; i < threadsCount; i++) {
            const startIdx = i * chunkSize;
            const endIdx = Math.min((i + 1) * chunkSize, prices.length);
            const chunk = prices.slice(startIdx, endIdx);

            const workerPromise = new Promise<{ profit: number, tradesExecuted: number }>((resolve, reject) => {
                const worker = new Worker(workerPath, {
                    workerData: { chunk },
                    execArgv: ['--import', 'tsx'] 
                });

                worker.on('message', resolve);
                worker.on('error', reject);
                worker.on('exit', (code) => {
                    if (code !== 0) reject(new Error(`Воркер зупинився з кодом ${code}`));
                });
            });

            workers.push(workerPromise);
        }

        const results = await Promise.all(workers);

        let totalProfit = 0;
        let totalTrades = 0;
        results.forEach(res => {
            totalProfit += res.profit;
            totalTrades += res.tradesExecuted;
        });

        const end = performance.now();
        return { duration: end - start, profit: totalProfit, trades: totalTrades };
    }
}