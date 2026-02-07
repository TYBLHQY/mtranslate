export interface YoudaoWebNewService {
  data: string;
  request: string;
  response: {
    exp: Array<{ po: string; tr: string[] }>;
    examType: string[];
    audio: Array<{ text: string; url: string }>;
    form: Array<{ form: string; type: string }>;
  };
}

export interface YoudaoWebOldService {
  data: string;
  request: string;
  response: {
    text: string;
    audio: Array<{ text: string; url: string }>;
    error?: string;
  };
}
