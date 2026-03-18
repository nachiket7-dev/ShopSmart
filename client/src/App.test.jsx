import { render, screen } from '@testing-library/react';
import App from './App';
import { describe, it, expect, vi } from 'vitest';

describe('App', () => {
    it('renders ShopSmart title and fetches products', async () => {
        // Mock fetch
        window.fetch = vi.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve([{ 
                    id: 1, 
                    name: 'Premium Tech Device', 
                    price: 99.99, 
                    description: 'Test description', 
                    image: 'test.jpg' 
                }])
            })
        );

        render(<App />);

        // Check if ShopSmart title elements exist
        const elements = screen.getAllByText(/ShopSmart/i);
        expect(elements.length).toBeGreaterThan(0);
        expect(elements[0]).toBeInTheDocument();

        // Check if the mock product is rendered correctly after fetching
        const productTitle = await screen.findByText('Premium Tech Device');
        expect(productTitle).toBeInTheDocument();

        const productPrice = screen.getByText('$99.99');
        expect(productPrice).toBeInTheDocument();
    });
});
