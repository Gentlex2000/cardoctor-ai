import type { DiagnosisResult } from '@/types';
import { generateMockDiagnosis } from '@/data/mockDiagnosis';

/**
 * AI Diagnosis Service
 *
 * Calls the Supabase Edge Function `diagnose` which proxies to OpenAI GPT-4o.
 * The OPENAI_API_KEY is stored securely in the Supabase vault — never exposed
 * to the browser.
 *
 * If the edge function returns an error, it is thrown so the UI can display it.
 * If the network request itself fails, falls back to mock data.
 */

interface DiagnoseParams {
  carModel: string;
  symptom: string;
  imageDataUrl?: string;
}

export class DiagnosisError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DiagnosisError';
  }
}

export async function diagnose(params: DiagnoseParams): Promise<DiagnosisResult> {
  const { carModel, symptom, imageDataUrl } = params;

  let response: Response;
  try {
    const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/diagnose`;
    response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ carModel, symptom, imageDataUrl }),
    });
  } catch {
    // Network failure — fall back to mock so the UI still works
    console.error('Network error calling edge function, using mock data');
    await new Promise((resolve) => setTimeout(resolve, 800));
    return generateMockDiagnosis(carModel, symptom);
  }

  const data = await response.json();

  if (!response.ok || data.error) {
    const message = data.error || `診斷服務錯誤 (${response.status})`;
    console.error('Edge function error:', response.status, message);
    throw new DiagnosisError(message);
  }

  // Validate the response has the expected structure
  if (!data.causes || !data.steps || !data.tools || !data.materials) {
    console.error('Unexpected AI response structure:', data);
    throw new DiagnosisError('AI 回應格式不符合預期');
  }

  return data as DiagnosisResult;
}
