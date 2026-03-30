export interface BingService {
  request: string;
  response: {
    word: string;
    trs: Array<{ pos?: string; def?: string }>;
    aus: Array<{ key: string; audio?: string; phonetic?: string }>;
    ecs: Array<{ pos?: string; lis: string[] }>;
    sentences: Array<{ eng: string; chs: string }>;
    presents: string[];
  };
}

export default BingService;
