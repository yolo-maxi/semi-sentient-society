const configuredKeys = (process.env.SSS_PUBLIC_API_KEYS ?? '')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);

export function isValidApiKey(apiKey: string): boolean {
  return configuredKeys.includes(apiKey);
}

export function hasConfiguredApiKeys(): boolean {
  return configuredKeys.length > 0;
}
