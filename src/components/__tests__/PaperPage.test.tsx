import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PaperPage from '../PaperPage';
import '@testing-library/jest-dom';

// Mock fetch
global.fetch = vi.fn();

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockImplementation(() => ({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null
}));
window.IntersectionObserver = mockIntersectionObserver as any;

const mockData = {
    meta: {
        title: 'Test Paper Title',
        authors: ['Author One', 'Author Two'],
        tags: ['Tag1', 'Tag2'],
        date: '2025-01-01',
        paperLink: 'http://example.com/paper.pdf',
    },
    sections: [
        {
            id: 'intro',
            title: 'Introduction',
            type: 'text',
            content: ['<p>Intro paragraph 1</p>', '<p>Intro paragraph 2</p>'],
        },
        {
            id: 'gallery',
            title: 'Gallery Section',
            type: 'gallery',
            content: ['1', '2'],
        },
    ],
};

describe('PaperPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders loading state initially', () => {
        (fetch as any).mockReturnValue(new Promise(() => { })); // Never resolves
        render(<PaperPage />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renders paper data correctly after fetch', async () => {
        (fetch as any).mockResolvedValue({
            ok: true,
            json: async () => mockData,
        });

        render(<PaperPage />);

        await waitFor(() => {
            expect(screen.getByText('Test Paper Title')).toBeInTheDocument();
        });

        expect(screen.getByText('Author One, Author Two')).toBeInTheDocument();
        expect(screen.getAllByText('Introduction').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Gallery Section').length).toBeGreaterThan(0);
        const paragraphs = screen.getAllByText('Intro paragraph 1');
        expect(paragraphs.length).toBeGreaterThan(0);
        expect(paragraphs[0]).toBeInTheDocument();
    });

    it('handles fetch error', async () => {
        (fetch as any).mockRejectedValue(new Error('Network error'));

        render(<PaperPage />);

        await waitFor(() => {
            expect(screen.getByText('Error: Network error')).toBeInTheDocument();
        });
    });

    it('renders gallery items', async () => {
        (fetch as any).mockResolvedValue({
            ok: true,
            json: async () => mockData,
        });

        render(<PaperPage />);

        await waitFor(() => {
            expect(screen.getByText('图 1')).toBeInTheDocument();
            expect(screen.getByText('图 2')).toBeInTheDocument();
        });
    });
});
