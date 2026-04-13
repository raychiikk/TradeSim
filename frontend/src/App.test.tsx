import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom'; 
import App from './App';

// оскільки наш App при запуску робить fetch-запит на бекенд за ордерами,
// ми маємо "замокати" (симулювати) цей запит, щоб тест не намагався лізти в реальну мережу
const mockFetch = vi.fn(() =>
    Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
    })
);

vi.stubGlobal('fetch', mockFetch);

describe('TradeSim Terminal v2.0 UI', () => {
    
    beforeEach(() => {
        vi.clearAllMocks(); 
    });

    it('має рендерити головний заголовок програми (Terminal v2.0)', () => {
        render(<App />); 
        
        const heading = screen.getByText(/TradeSim Terminal v2.0/i);
        
        expect(heading).toBeInTheDocument();
    });

    it('має відображати кнопки вибору стратегій бота (Pattern: Strategy)', () => {
        render(<App />);
        
        const maButton = screen.getByText(/Moving Average/i);
        const rsiButton = screen.getByText(/RSI Strategy/i);
        
        expect(maButton).toBeInTheDocument();
        expect(rsiButton).toBeInTheDocument();
    });

    it('має відображати блок Активного балансу', () => {
        render(<App />);
        
        const balanceHeading = screen.getByText(/Активний баланс/i);
        const balanceValue = screen.getByText(/\$12,450\.00/i);
        
        expect(balanceHeading).toBeInTheDocument();
        expect(balanceValue).toBeInTheDocument();
    });

    it('має відображати таблицю історії транзакцій (Pattern: Singleton)', () => {
        render(<App />);
        
        const historyHeading = screen.getByText(/Історія транзакцій/i);
        const tableHeaderOrderId = screen.getByText(/Order ID/i);
        const tableHeaderSymbol = screen.getByText(/Інструмент/i);
        
        expect(historyHeading).toBeInTheDocument();
        expect(tableHeaderOrderId).toBeInTheDocument();
        expect(tableHeaderSymbol).toBeInTheDocument();
    });
});