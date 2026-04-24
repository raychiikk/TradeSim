import { parentPort, workerData } from 'worker_threads';

function runHeavyMarketAnalysis(prices: number[]): { profit: number, tradesExecuted: number } {
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

    return { profit, tradesExecuted };
}

if (parentPort && workerData) {
    const { chunk } = workerData;
    
    const result = runHeavyMarketAnalysis(chunk);
    
    parentPort.postMessage(result);
}