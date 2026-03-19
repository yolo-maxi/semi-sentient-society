import openApiDocument from '@/data/openapi/agent-verification-v1.json';
import { jsonResponse } from '@/lib/api/v1';

export async function GET() {
  return jsonResponse(openApiDocument);
}
