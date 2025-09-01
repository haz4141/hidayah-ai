import hadithData from "@/data/hadith.json";

export type Hadith = {
  id: string;
  collection: string;
  book: number;
  hadith: number;
  arabic: string;
  translation: string;
  narrator: string;
  grading: string;
  category: string;
  keywords: string[];
};

export type Collection = {
  name: string;
  code: string;
  description: string;
  total_hadiths: number;
};

export type HadithFilters = {
  collection?: string;
  category?: string;
  search?: string;
  grading?: string;
  narrator?: string;
};

export type HadithSearchResult = {
  hadiths: Hadith[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

/**
 * Search hadiths with filters
 */
export function searchHadiths(filters: HadithFilters, page: number = 1, limit: number = 20): HadithSearchResult {
  let filteredHadiths = hadithData.hadiths as Hadith[];
  
  // Filter by collection
  if (filters.collection) {
    filteredHadiths = filteredHadiths.filter(h => h.collection === filters.collection);
  }
  
  // Filter by category
  if (filters.category) {
    filteredHadiths = filteredHadiths.filter(h => h.category === filters.category);
  }
  
  // Filter by grading
  if (filters.grading) {
    filteredHadiths = filteredHadiths.filter(h => h.grading === filters.grading);
  }
  
  // Filter by narrator
  if (filters.narrator) {
    filteredHadiths = filteredHadiths.filter(h => 
      h.narrator.toLowerCase().includes(filters.narrator!.toLowerCase())
    );
  }
  
  // Search in Arabic text, translation, and keywords
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filteredHadiths = filteredHadiths.filter(h => 
      h.arabic.toLowerCase().includes(searchLower) ||
      h.translation.toLowerCase().includes(searchLower) ||
      h.keywords.some(keyword => keyword.toLowerCase().includes(searchLower)) ||
      h.narrator.toLowerCase().includes(searchLower)
    );
  }
  
  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedHadiths = filteredHadiths.slice(startIndex, endIndex);
  
  return {
    hadiths: paginatedHadiths,
    total: filteredHadiths.length,
    page,
    limit,
    totalPages: Math.ceil(filteredHadiths.length / limit)
  };
}

/**
 * Get all collections
 */
export function getCollections(): Collection[] {
  return hadithData.collections as Collection[];
}

/**
 * Get unique categories
 */
export function getCategories(): string[] {
  const hadiths = hadithData.hadiths as Hadith[];
  const categories = new Set(hadiths.map(h => h.category));
  return Array.from(categories).sort();
}

/**
 * Get unique gradings
 */
export function getGradings(): string[] {
  const hadiths = hadithData.hadiths as Hadith[];
  const gradings = new Set(hadiths.map(h => h.grading));
  return Array.from(gradings).sort();
}

/**
 * Get unique narrators
 */
export function getNarrators(): string[] {
  const hadiths = hadithData.hadiths as Hadith[];
  const narrators = new Set(hadiths.map(h => h.narrator));
  return Array.from(narrators).sort();
}

/**
 * Get hadith by ID
 */
export function getHadithById(id: string): Hadith | undefined {
  const hadiths = hadithData.hadiths as Hadith[];
  return hadiths.find(h => h.id === id);
}

/**
 * Get random hadith
 */
export function getRandomHadith(): Hadith {
  const hadiths = hadithData.hadiths as Hadith[];
  const randomIndex = Math.floor(Math.random() * hadiths.length);
  return hadiths[randomIndex];
}

/**
 * Get hadiths by category
 */
export function getHadithsByCategory(category: string): Hadith[] {
  const hadiths = hadithData.hadiths as Hadith[];
  return hadiths.filter(h => h.category === category);
}

/**
 * Get hadiths by collection
 */
export function getHadithsByCollection(collection: string): Hadith[] {
  const hadiths = hadithData.hadiths as Hadith[];
  return hadiths.filter(h => h.collection === collection);
}

/**
 * Format hadith number for display
 */
export function formatHadithNumber(collection: string, book: number, hadith: number): string {
  const collectionNames: Record<string, string> = {
    bukhari: "Bukhari",
    muslim: "Muslim", 
    tirmidhi: "Tirmidhi",
    nasai: "Nasai",
    abudawud: "Abu Dawud",
    ibnmajah: "Ibn Majah"
  };
  
  return `${collectionNames[collection] || collection} ${book}:${hadith}`;
}

/**
 * Get grading color class
 */
export function getGradingColor(grading: string): string {
  const colors: Record<string, string> = {
    "Sahih": "bg-green-100 text-green-800",
    "Hasan": "bg-blue-100 text-blue-800", 
    "Da'if": "bg-yellow-100 text-yellow-800",
    "Mawdu'": "bg-red-100 text-red-800"
  };
  
  return colors[grading] || "bg-gray-100 text-gray-800";
}
