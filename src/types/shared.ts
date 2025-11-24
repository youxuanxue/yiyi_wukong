export interface PaperMetadata {
    title: string;
    authors: string[];
    tags: string[];
    date: string;
    paperLink: string;
}

export type SectionType = 'text' | 'gallery';

export interface PaperSection {
    id: string;
    title: string;
    type: SectionType;
    content: string[];
    isNew?: boolean;
}

export interface PaperData {
    meta: PaperMetadata;
    sections: PaperSection[];
}
