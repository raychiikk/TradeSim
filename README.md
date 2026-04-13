# TradeSim Terminal v2.0: Algorithmic Trading Simulator & Backtester

**TradeSim** — це високопродуктивна клієнт-серверна система для розробки, тестування та аналізу алгоритмічних торгових стратегій. 

Проєкт дозволяє перевіряти торгові гіпотези (бектестинг), керувати ордерами та аналізувати ринкові дані через зручний графічний інтерфейс, використовуючи сучасні підходи до проєктування програмного забезпечення.

---

## Основний функціонал

* **Інтерактивний GUI (Terminal v2.0):** Сучасний веб-інтерфейс для керування стратегіями, розміщення ордерів та перегляду історії транзакцій у реальному часі.
* **Гнучкий конструктор стратегій:** Динамічне перемикання між торговими алгоритмами (Moving Average, RSI) "на льоту".
* **Керування ордерами (Order Management):** Повний життєвий цикл ордерів (Pending, Filled, Canceled) із можливістю скасування останньої дії (Undo).
* **Збереження даних:** Надійне зберігання історії транзакцій у реляційній базі даних.
* **Висока продуктивність та Бектестинг:** Використання кешування для оптимізації мережевих запитів та підготовка до мультипоточного тестування (Worker Threads).

---

## Технологічний стек

Проєкт розділено на незалежні клієнтську та серверну частини (REST API):

**Frontend (Клієнт):**
* **Core:** TypeScript, React 19
* **Styling:** Tailwind CSS 4
* **Build Tool:** Vite

**Backend (Сервер):**
* **Core:** Node.js, Express, TypeScript
* **Database:** PostgreSQL, Prisma ORM
* **Architecture:** SOLID, Layered Architecture

**Тестування та Документація:**
* **Unit & UI Tests:** Vitest, React Testing Library, jsdom
* **Docs:** TypeDoc (автоматична генерація JSDoc), PlantUML

---

## Архітектура та Патерни проєктування (GoF)

Бекенд системи побудовано з використанням **12 класичних патернів проєктування**, що забезпечує низьку зв'язність (Low Coupling) та високу гнучкість:

* **Твірні:** * `Singleton` (TradeHistory) — єдиний глобальний стан історії.
  * `Factory Method` (OrderFactory) — інкапсуляція створення Market та Limit ордерів.
* **Структурні:** * `Proxy` (CachedPriceProxy) — кешування запитів до біржі.
  * `Facade` (TradingFacade) — спрощений інтерфейс для швидкої торгівлі.
  * `Decorator` (OrderDecorator) — динамічне додавання комісій до ордерів.
  * `Adapter` (BinanceAdapter) — інтеграція із зовнішніми API.
  * `Composite` (CompositeOrder) — групування кількох ордерів в один масив.
* **Поведінкові:** * `Strategy` (TradingStrategy) — взаємозамінні торгові алгоритми.
  * `Command` (PlaceOrderCommand) — інкапсуляція запитів та функція Undo.
  * `State` (OrderState) — керування станами ордера (Pending/Filled/Canceled).
  * `Observer` (TradeNotifier) — реактивна система сповіщень (Event Driven).
  * `Template Method` (BacktestTemplate) — каркас для алгоритмів бектестингу.

---

## Встановлення та запуск

### 1. Клонування репозиторію
```bash
git clone [https://github.com/raychiikk/TradeSim.git](https://github.com/raychiikk/TradeSim.git)
cd TradeSim