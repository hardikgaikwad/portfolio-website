/* ═══════════════════════════════════════════════════════════
   URL Security Utilities — Strict scheme & protocol validation
   Protects against Stored/DOM XSS, open redirects & javascript: execution
   ═══════════════════════════════════════════════════════════ */

/**
 * Validates whether a URL is safe for navigation or hyperlink rendering.
 * Only allows HTTP, HTTPS, MAILTO, or safe relative paths starting with '/'.
 * Explicitly rejects javascript:, data:, vbscript:, and protocol-relative '//'.
 */
export function isSafeUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return false;
  }

  // Reject dangerous schemes immediately (case-insensitive)
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('file:') ||
    lower.startsWith('//')
  ) {
    return false;
  }

  // Allow safe local relative paths
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return true;
  }

  // Validate absolute URL schemes
  try {
    const parsed = new URL(trimmed, 'https://placeholder.invalid');
    // If original string did not start with a scheme, URL parser used base
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    }
    if (trimmed.startsWith('mailto:')) {
      return parsed.protocol === 'mailto:';
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Returns the URL if safe, or a fallback URL if invalid/malicious.
 */
export function sanitizeUrl(url: string | null | undefined, fallback = ''): string {
  if (isSafeUrl(url)) {
    return url!.trim();
  }
  return fallback;
}
