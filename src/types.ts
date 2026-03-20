export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: 'supermarket' | 'restaurant' | 'rent' | 'leisure' | 'other';
  type: 'income' | 'expense';
}

export interface Dream {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  icon: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  caption: string;
  date: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: 'nursing' | 'bible';
  difficulty: 'easy' | 'medium' | 'advanced' | 'hard' | 'professional';
  questions: QuizQuestion[];
}

export interface Video {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  date: string;
  isFavorite?: boolean;
}
