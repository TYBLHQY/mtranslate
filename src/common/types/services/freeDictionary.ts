export interface Language {
  code: string;
  name: string;
}

export interface Form {
  word: string;
  tags: string[];
}

export type PronunciationType = "ipa" | "enpr";

export interface Pronunciation {
  type: PronunciationType;
  text: string;
  tags: string[];
}

export interface Quote {
  text: string;
  reference: string;
}

export interface Translation {
  language: Language;
  word: string;
}

export interface Sense {
  definition: string;
  tags: string[];
  examples: string[];
  quotes: Quote[];
  synonyms: string[];
  antonyms: string[];
  translations?: Translation[];
  subsenses?: Sense[];
}

export interface Entry {
  language: Language;
  partOfSpeech: string;
  pronunciations: Pronunciation[];
  forms: Form[];
  senses: Sense[];
  synonyms: string[];
  antonyms: string[];
}

export interface License {
  name: string;
  url: string;
}

export interface Source {
  url: string;
  license: License;
}

export interface EntriesByLanguageAndWord {
  word: string;
  entries: Entry[];
  source: Source;
}

export interface FreeDictionaryService {
  request: {
    language: string; // ISO code or "all"
    word: string;
    translations?: boolean;
    pretty?: boolean;
  };
  response: EntriesByLanguageAndWord;
}

export interface LanguageWithWords {
  code: string;
  name: string;
  words: number;
}

export interface FreeDictionaryLanguages {
  response: LanguageWithWords[];
}
