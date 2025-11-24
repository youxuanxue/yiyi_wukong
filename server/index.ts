import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { getDb } from './db.js';
import { PaperData } from '../src/types/shared.js';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// --- Routes ---

// Get all papers (with optional tag filter)
app.get('/api/papers', async (req, res) => {
    try {
        const db = await getDb();
        const { tag } = req.query;

        let papers = await db.all('SELECT id, title, authors, tags, date, paperLink FROM papers ORDER BY date DESC');

        // Filter by tag if provided
        if (tag && typeof tag === 'string') {
            papers = papers.filter(paper => {
                const tags = JSON.parse(paper.tags);
                return tags.includes(tag);
            });
        }

        // Parse JSON fields and return metadata only (no sections)
        const paperList = papers.map(paper => ({
            id: paper.id,
            meta: {
                title: paper.title,
                authors: JSON.parse(paper.authors),
                tags: JSON.parse(paper.tags),
                date: paper.date,
                paperLink: paper.paperLink,
            }
        }));

        res.json(paperList);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Get single paper by ID
app.get('/api/paper/:id', async (req, res) => {
    try {
        const db = await getDb();
        const { id } = req.params;

        const paper = await db.get('SELECT * FROM papers WHERE id = ?', id);

        if (!paper) {
            return res.status(404).json({ error: 'Paper not found' });
        }

        // Parse JSON fields
        const paperData: PaperData = {
            meta: {
                title: paper.title,
                authors: JSON.parse(paper.authors),
                tags: JSON.parse(paper.tags),
                date: paper.date,
                paperLink: paper.paperLink,
            },
            sections: JSON.parse(paper.sections),
        };

        res.json(paperData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Get latest paper (for backward compatibility)
app.get('/api/paper', async (req, res) => {
    try {
        const db = await getDb();
        const paper = await db.get('SELECT * FROM papers ORDER BY date DESC LIMIT 1');

        if (!paper) {
            return res.status(404).json({ error: 'No papers found' });
        }

        // Parse JSON fields
        const paperData: PaperData = {
            meta: {
                title: paper.title,
                authors: JSON.parse(paper.authors),
                tags: JSON.parse(paper.tags),
                date: paper.date,
                paperLink: paper.paperLink,
            },
            sections: JSON.parse(paper.sections),
        };

        res.json(paperData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Create a new paper
app.post('/api/paper', async (req, res) => {
    const newData: PaperData = req.body;
    if (!newData || !newData.meta || !newData.sections) {
        return res.status(400).json({ error: 'Invalid data structure' });
    }

    try {
        const db = await getDb();
        const id = uuidv4();
        await db.run(
            'INSERT INTO papers (id, title, authors, tags, date, paperLink, sections) VALUES (?, ?, ?, ?, ?, ?, ?)',
            id,
            newData.meta.title,
            JSON.stringify(newData.meta.authors),
            JSON.stringify(newData.meta.tags),
            newData.meta.date,
            newData.meta.paperLink,
            JSON.stringify(newData.sections)
        );
        res.status(201).json({ message: 'Paper created', id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Update a specific section
app.put('/api/paper/section/:id', async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;

    if (!Array.isArray(content)) {
        return res.status(400).json({ error: 'Content must be an array' });
    }

    try {
        const db = await getDb();
        const paper = await db.get('SELECT * FROM papers ORDER BY date DESC LIMIT 1');
        if (!paper) {
            return res.status(404).json({ error: 'No papers found' });
        }

        const sections = JSON.parse(paper.sections);
        const sectionIndex = sections.findIndex((s: any) => s.id === id);

        if (sectionIndex === -1) {
            return res.status(404).json({ error: 'Section not found' });
        }

        sections[sectionIndex].content = content;

        await db.run(
            'UPDATE papers SET sections = ? WHERE id = ?',
            JSON.stringify(sections),
            paper.id
        );

        res.json(sections[sectionIndex]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Delete a section
app.delete('/api/paper/section/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const db = await getDb();
        const paper = await db.get('SELECT * FROM papers ORDER BY date DESC LIMIT 1');
        if (!paper) {
            return res.status(404).json({ error: 'No papers found' });
        }

        let sections = JSON.parse(paper.sections);
        const initialLength = sections.length;
        sections = sections.filter((s: any) => s.id !== id);

        if (sections.length === initialLength) {
            return res.status(404).json({ error: 'Section not found' });
        }

        await db.run(
            'UPDATE papers SET sections = ? WHERE id = ?',
            JSON.stringify(sections),
            paper.id
        );

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
