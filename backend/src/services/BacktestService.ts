import { Worker } from 'worker_threads';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Сервіс для симуляції алгоритмічної торгівлі (бектестингу).
 * Забезпечує порівняльний аналіз продуктивності між послідовним обчисленням
 * в основному потоці та паралельним обчисленням за допомогою Worker Threads.
 */
export class BacktestService {
    
    /**
     * Генерує масив псевдовипадкових ринкових цін для симуляції історичних котирувань.
     * Використовує Float64Array для початкової генерації з метою оптимізації роботи з пам'яттю.
     * * @param size - Загальна кількість записів цін, яку необхідно згенерувати.
     * @returns Масив згенерованих котирувань типу number[].
     */
    public generateMockData(size: number): number[] {
        const data = new Float64Array(size); 
        let currentPrice = 50000; 
        for (let i = 0; i < size; i++) {
            currentPrice += (Math.random() - 0.5) * 10; 
            data[i] = currentPrice;
        }
        return Array.from(data);
    }

    /**
     * Запускає послідовний аналіз ринку в головному потоці (Main Thread).
     * Імітує ресурсомісткі математичні операції для розрахунку тригерів торгових стратегій.
     * * @param prices - Масив історичних котирувань для аналізу.
     * @returns Об'єкт із результатами тестування: час виконання (duration), прибуток (profit) та кількість угод (trades).
     */
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

    /**
     * Асинхронно розподіляє обробку масиву даних між декількома паралельними потоками.
     * Реалізує механізм перекриття даних (Data Overlap) на межах чанків для збереження контексту індикаторів,
     * зміщуючи індекс початку для кожного потоку (окрім першого) на 100 елементів назад.
     * * @param prices - Повний масив історичних котирувань.
     * @param threadsCount - Кількість виділених потоків (Worker Threads) для обробки.
     * @returns Проміс із агрегованими результатами роботи всіх воркерів.
     */
    public async runParallel(prices: number[], threadsCount: number): Promise<{ duration: number, profit: number, trades: number }> {
        const start = performance.now();
        const chunkSize = Math.ceil(prices.length / threadsCount);
        
        const workerPath = path.resolve(__dirname, '../workers/backtest.worker.ts');
        
        const workers: Promise<{ profit: number, tradesExecuted: number }>[] = [];

        for (let i = 0; i < threadsCount; i++) {
            let startIdx = i * chunkSize;
            
            if (i > 0) {
                startIdx -= 100;
            }

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