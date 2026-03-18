import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('App Component', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it('displays the loading indicator initially', () => {
        // Mock a pending promise so loading state persists
        global.fetch = vi.fn(() => new Promise(() => {}));
        
        const { container } = render(<App />);
        // By checking for the loading spinner class
        expect(container.querySelector('.animate-spin')).toBeInTheDocument();
        
        // Ensure ShopSmart title is still present
        const titleElements = screen.getAllByText(/ShopSmart/i);
        expect(titleElements.length).toBeGreaterThan(0);
    });

    it('renders products correctly after successful fetch', async () => {
        const mockProducts = [
            { id: 1, name: 'Premium Tech Device', price: 99.99, description: 'Test description', image: 'test.jpg' },
            { id: 2, name: 'Wireless Headphones', price: 149.00, description: 'Awesome sound', image: 'test2.jpg' }
        ];

        window.fetch = vi.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve(mockProducts)
            })
        );

        render(<App />);

        // Wait for products to load and replace loading spinner
        const product1 = await screen.findByText('Premium Tech Device');
        const product2 = await screen.findByText('Wireless Headphones');
        
        expect(product1).toBeInTheDocument();
        expect(product2).toBeInTheDocument();
        expect(screen.getByText('$99.99')).toBeInTheDocument();
        expect(screen.getByText('$149.00')).toBeInTheDocument();
        expect(screen.getByText('2 Items')).toBeInTheDocument();
    });

    it('handles fetch errors gracefully', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        
        window.fetch = vi.fn(() => Promise.reject(new Error('API Down')));
        
        const { container } = render(<App />);

        // Spinner should disappear eventually when loading state is set to false in the catch block
        await waitFor(() => {
            expect(container.querySelector('.animate-spin')).not.toBeInTheDocument();
        });

        // The products grid handles empty arrays by showing no items, 0 Items label should exist
        expect(screen.getByText('0 Items')).toBeInTheDocument();
        
        // Console error should have been called
        expect(consoleSpy).toHaveBeenCalledWith('Error fetching products:', expect.any(Error));
        
        consoleSpy.mockRestore();
    });
});
