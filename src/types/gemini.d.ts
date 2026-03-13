
export interface GeminiMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface GeminiResponse {
  text(): string;
}

export interface GeminiResult {
  response: Promise<GeminiResponse>;
}
