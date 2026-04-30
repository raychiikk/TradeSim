import { useState } from 'react';

export default function BacktestPanel() {
    const [size, setSize] = useState(1000000);
    const [threads, setThreads] = useState(4);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const runBenchmark = async () => {
        setLoading(true);
        setResult(null);
        try {
            // Звертаємося до нашого бекенду на порт 3001
            const response = await fetch(`http://localhost:3001/api/backtest?size=${size}&threads=${threads}`);
            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error("Помилка запиту", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg text-white mb-6 border border-slate-700">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">Мультипоточний Бектестинг (Лаба №3)</h2>
            <p className="text-slate-400 mb-6 text-sm">
                Порівняння швидкодії розрахунку торгових індикаторів на великих масивах ринкових даних (Sequential vs Parallel).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block text-sm mb-2 text-slate-300">Кількість котирувань (Розмір даних):</label>
                    <select 
                        value={size} 
                        onChange={(e) => setSize(Number(e.target.value))}
                        className="w-full bg-slate-900 p-3 rounded-lg border border-slate-600 focus:border-blue-500 outline-none"
                    >
                        <option value={500000}>500 000 записів (Швидко)</option>
                        <option value={1000000}>1 000 000 записів (Нормально)</option>
                        <option value={5000000}>5 000 000 записів (Важко)</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm mb-2 text-slate-300">Кількість потоків (Worker Threads):</label>
                    <select 
                        value={threads} 
                        onChange={(e) => setThreads(Number(e.target.value))}
                        className="w-full bg-slate-900 p-3 rounded-lg border border-slate-600 focus:border-blue-500 outline-none"
                    >
                        <option value={2}>2 потоки</option>
                        <option value={4}>4 потоки</option>
                        <option value={8}>8 потоків</option>
                    </select>
                </div>
            </div>

            <button 
                onClick={runBenchmark}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 font-bold py-3 rounded-lg transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed shadow-md"
            >
                {loading ? 'Виконання важких математичних обчислень...' : ' Запустити Benchmark'}
            </button>

            {/* Блок з результатами */}
            {result && (
                <div className="mt-6 p-5 bg-slate-900/80 rounded-xl border border-slate-700">
                    <h3 className="text-xl font-semibold mb-4 text-green-400 flex items-center gap-2">
                        <span></span> Результати тестування:
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
                        <div className="bg-slate-800 p-4 rounded-lg border-l-4 border-slate-500">
                            <span className="text-slate-400 text-sm block mb-1">Один потік (Main Thread)</span>
                            <span className="font-mono text-2xl">⏱ {result.sequential.duration.toFixed(0)} мс</span>
                        </div>
                        <div className="bg-slate-800 p-4 rounded-lg border-l-4 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                            <span className="text-blue-400 text-sm block mb-1">{result.threadsUsed} потоки (Worker Threads)</span>
                            <span className="font-mono text-2xl text-blue-300">⏱ {result.parallel.duration.toFixed(0)} мс</span>
                        </div>
                    </div>

                    <div className="mt-5 text-center">
                        <span className="inline-block bg-green-500/20 border border-green-500/50 text-green-400 px-6 py-2 rounded-full font-bold text-lg shadow-lg">
                            Прискорення: у {result.speedup} разів! 
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}