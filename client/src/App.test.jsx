import { render, screen } from '@testing-library/react';
import App from './App';
import { describe, it, expect, vi } from 'vitest';

describe('App', () => {
    it('renders ShopSmart title', () => {
        // Mock fetch
        window.fetch = vi.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve([{ id: 1, name: 'Product', price: 10 }])
            })
        );

        render(<App />);
        const elements = screen.getAllByText(/ShopSmart/i);
        expect(elements.length).toBeGreaterThan(0);
        expect(elements[0]).toBeInTheDocument();
    });
});
