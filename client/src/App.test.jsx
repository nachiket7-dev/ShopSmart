import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';

// Mock localStorage for jsdom
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: vi.fn((key) => store[key] || null),
        setItem: vi.fn((key, val) => {
            store[key] = val;
        }),
        removeItem: vi.fn((key) => {
            delete store[key];
        }),
        clear: vi.fn(() => {
            store = {};
        }),
    };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

beforeEach(() => {
    vi.restoreAllMocks();
    localStorageMock.clear();
});

describe('App Component', () => {
    it('renders the Navbar with ShopSmart title', () => {
        global.fetch = vi.fn(() =>
            Promise.resolve({ ok: true, json: () => Promise.resolve({ products: [] }) }),
        );

        render(<App />);
        const elements = screen.getAllByText(/ShopSmart/i);
        expect(elements.length).toBeGreaterThan(0);
    });

    it('renders the homepage with product grid', async () => {
        const mockProducts = [
            {
                _id: '1',
                name: 'Test Product',
                price: 49.99,
                description: 'Test',
                image: 'test.jpg',
            },
        ];

        global.fetch = vi.fn(() =>
            Promise.resolve({ ok: true, json: () => Promise.resolve({ products: mockProducts }) }),
        );

        render(<App />);
        const product = await screen.findByText('Test Product');
        expect(product).toBeInTheDocument();
    });
});
