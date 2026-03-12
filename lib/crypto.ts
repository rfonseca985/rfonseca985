// CannTrace Care - Cryptographic Utilities
// Implements SHA-256 hashing for batch integrity verification

/**
 * Generates a SHA-256 hash for batch integrity verification
 * This creates a "digital DNA" for each batch that can be used to verify
 * the batch has not been tampered with
 */
export async function generateBatchSeal(data: {
  codigo_qr: string;
  strain: string;
  status: string;
  timestamp?: string;
}): Promise<string> {
  const content = `${data.codigo_qr}-${data.strain}-${data.status}-${data.timestamp || new Date().toISOString()}`;
  
  // Use Web Crypto API for browser/edge compatibility
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  
  // Convert to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}

/**
 * Verifies if a batch's current state matches its recorded hash
 * Returns true if the batch has not been tampered with
 */
export async function verifyBatchIntegrity(
  data: {
    codigo_qr: string;
    strain: string;
    status: string;
    timestamp?: string;
  },
  expectedHash: string
): Promise<boolean> {
  const currentHash = await generateBatchSeal(data);
  return currentHash === expectedHash;
}

/**
 * Generates a unique QR code identifier for a new batch
 */
export function generateQRCode(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `CT-${timestamp}-${randomPart}`;
}

/**
 * Encrypts sensitive data using AES-256-GCM
 * Note: In production, use a proper key management system
 */
export async function encryptSensitiveData(
  data: string,
  keyMaterial: string
): Promise<{ encrypted: string; iv: string }> {
  const encoder = new TextEncoder();
  
  // Derive key from key material
  const keyData = encoder.encode(keyMaterial.padEnd(32, '0').slice(0, 32));
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  );
  
  // Generate random IV
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  // Encrypt
  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(data)
  );
  
  // Convert to base64
  const encrypted = btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer)));
  const ivBase64 = btoa(String.fromCharCode(...iv));
  
  return { encrypted, iv: ivBase64 };
}

/**
 * Decrypts sensitive data using AES-256-GCM
 */
export async function decryptSensitiveData(
  encrypted: string,
  iv: string,
  keyMaterial: string
): Promise<string> {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  
  // Derive key from key material
  const keyData = encoder.encode(keyMaterial.padEnd(32, '0').slice(0, 32));
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  );
  
  // Decode base64
  const encryptedBuffer = Uint8Array.from(atob(encrypted), c => c.charCodeAt(0));
  const ivBuffer = Uint8Array.from(atob(iv), c => c.charCodeAt(0));
  
  // Decrypt
  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: ivBuffer },
    key,
    encryptedBuffer
  );
  
  return decoder.decode(decryptedBuffer);
}
