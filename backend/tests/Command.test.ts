// backend/tests/Command.test.ts
import { describe, it, expect, vi } from 'vitest';
import { PlaceOrderCommand, TradingTerminal } from '../src/services/Command';

describe('Pattern: Command', () => {
    it('PlaceOrderCommand має викликати execute ордера та додати його в історію', () => {
        const mockOrder = { id: 'ord-123', execute: vi.fn() };
        const mockHistory = { addOrder: vi.fn() };
        
        const command = new PlaceOrderCommand(mockOrder as any, mockHistory as any);
        command.execute();

        expect(mockOrder.execute).toHaveBeenCalledTimes(1);
        expect(mockHistory.addOrder).toHaveBeenCalledWith(mockOrder);
    });

    it('TradingTerminal має виконувати команди та зберігати їх в історію', () => {
        const terminal = new TradingTerminal();
        const mockCommand = { execute: vi.fn(), undo: vi.fn() };

        terminal.executeCommand(mockCommand);
        
        expect(mockCommand.execute).toHaveBeenCalledTimes(1);
        expect((terminal as any).commandHistory.length).toBe(1);
    });

    it('TradingTerminal має скасовувати останню команду', () => {
        const terminal = new TradingTerminal();
        const mockCommand = { execute: vi.fn(), undo: vi.fn() };

        terminal.executeCommand(mockCommand);
        terminal.undoLastCommand();
        
        expect(mockCommand.undo).toHaveBeenCalledTimes(1);
        expect((terminal as any).commandHistory.length).toBe(0);
    });
});