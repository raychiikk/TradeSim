import { useEffect, useState } from 'react';

interface Order {
  id: string;
  orderId: string;
  symbol: string;
  side: string;
  amount: number;
  type: string;
  createdAt: string;
}

function App() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Помилка при отриманні даних:", error);
    } finally {
      setLoading(false);
    }
  };

  const changeStrategy = async (strategyName: string) => {
    try {
      await fetch('http://localhost:3001/api/strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ strategy: strategyName })
      });
      console.log(`Стратегію змінено на: ${strategyName}`);
    } catch (error) {
      console.error("Не вдалося змінити стратегію:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-white p-6 font-sans">
      
      <header className="max-w-7xl w-full mx-auto mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            TradeSim Terminal v2.0
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Керування патернами проєктування & PostgreSQL
          </p>
        </div>
        <div className="flex items-center gap-3 bg-slate-800/50 border border-slate-700 p-2 rounded-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-mono text-slate-300">API STATUS: ONLINE</span>
        </div>
      </header>


      <main className="flex-1 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        <aside className="lg:col-span-1 flex flex-col justify-between h-auto lg:h-[440px]">
          <section className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl">
            <h2 className="text-lg font-semibold mb-4 text-blue-300">Алгоритм бота</h2>
            <div className="grid gap-3">
              <button 
                onClick={() => changeStrategy('MovingAverage')}
                className="group relative w-full py-4 bg-slate-700 hover:bg-blue-600 rounded-xl transition-all duration-300 overflow-hidden"
              >
                <div className="relative z-10 font-bold">Moving Average</div>
                <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </button>

              <button 
                onClick={() => changeStrategy('RSI')}
                className="group relative w-full py-4 bg-slate-700 hover:bg-purple-600 rounded-xl transition-all duration-300 overflow-hidden"
              >
                <div className="relative z-10 font-bold">RSI Strategy</div>
                <div className="absolute inset-0 bg-purple-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </button>
            </div>
            
            <p className="mt-4 text-[10px] text-slate-500 leading-relaxed italic text-center">
              Обрана стратегія активується миттєво. Ваші налаштування автоматично зберігаються для майбутніх торгових сесій.
            </p>
          </section>

          <section className="bg-indigo-950/20 border border-indigo-500/30 rounded-2xl p-6 shadow-lg mt-6 lg:mt-0">
            <div className="mb-4">
              <h3 className="font-bold text-indigo-300 text-xs uppercase tracking-widest">Активний баланс</h3>
            </div>
            <div className="text-3xl font-mono font-bold text-white tracking-tight">$12,450.00</div>
            <div className="flex items-center gap-2 mt-3">
              <div className="px-2 py-0.5 rounded bg-green-500/10 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-green-400"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                <span className="text-green-400 text-[11px] font-bold">+2.4%</span>
              </div>
              <span className="text-slate-500 text-[10px]">за сьогодні</span>
            </div>
          </section>
        </aside>

        <div className="lg:col-span-3 h-auto lg:h-[440px]">
          <section className="h-full flex flex-col bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-700 flex justify-between items-center bg-slate-800/50 shrink-0">
              <h2 className="text-xl font-semibold text-slate-100">Історія транзакцій</h2>
              <span className="text-[10px] bg-slate-700 px-2 py-1 rounded text-slate-400 uppercase tracking-tighter">
                Live From PostgreSQL
              </span>
            </div>

            <div className="flex-1 overflow-y-auto text-sm relative">
              <table className="w-full text-left border-collapse">

                <thead className="sticky top-0 bg-slate-900/95 backdrop-blur-sm z-10 shadow-sm">
                  <tr className="text-slate-500 uppercase text-[11px] tracking-wider">
                    <th className="px-6 py-4 font-semibold">Order ID</th>
                    <th className="px-6 py-4 font-semibold">Інструмент</th>
                    <th className="px-6 py-4 font-semibold">Сторона</th>
                    <th className="px-6 py-4 font-semibold">Кількість</th>
                    <th className="px-6 py-4 font-semibold text-right">Час</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-700/20 transition-colors group">
                        <td className="px-6 py-4 font-mono text-blue-400 text-xs">{order.orderId}</td>
                        <td className="px-6 py-4 font-bold text-slate-200">{order.symbol}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            order.side === 'buy' 
                              ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                              : 'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}>
                            {order.side}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono text-slate-300">{order.amount}</td>
                        <td className="px-6 py-4 text-right text-slate-500 font-mono text-xs">
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic">
                        {loading ? "Завантаження даних з бази..." : "Немає активних ордерів у базі даних."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

      </main>
    </div>
  );
}

export default App;
