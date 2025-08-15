export interface Phrase {
  id: string;
  text: string;
  createdAt: string;
  tags: string[];
  author?: string;
  category?: string;
  likes?: number;
}

export interface PhraseFormValues {
  text: string;
  tags: string;
  author: string;
  category: string;
}

export type SortBy = 'date' | 'text' | 'likes' | 'author';
export type SortOrder = 'asc' | 'desc';
export type ViewMode = 'grid' | 'list' | 'virtual';