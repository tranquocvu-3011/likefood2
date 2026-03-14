/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * SEC-005: Field-level Encryption for Sensitive Data
 *
 * Encrypts/decrypts PII and financial data at rest.
 * Uses AES-256-GCM with a unique IV per encryption.
 */

const ALGORITHM = "AES-GCM";
const IV_LENGTH = 12; // 96 bits — recommended for GCM
const KEY_LENGTH = 256; // bits

/**
 * Get or derive encryption key from env
 */
async function getKey(): Promise<CryptoKey> {
    const secret = process.env.ENCRYPTION_KEY || process.env.NEXTAUTH_SECRET;
    if (!secret) {
        throw new Error("ENCRYPTION_KEY or NEXTAUTH_SECRET must be set for field encryption");
    }

    // Derive a key from the secret using PBKDF2
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        encoder.encode(secret),
        "PBKDF2",
        false,
        ["deriveKey"]
    );

    return crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: encoder.encode("likefood-field-encryption-v1"),
            iterations: 100000,
            hash: "SHA-256",
        },
        keyMaterial,
        { name: ALGORITHM, length: KEY_LENGTH },
        false,
        ["encrypt", "decrypt"]
    );
}

/**
 * Encrypt a plaintext string
 * Returns base64-encoded string: iv:ciphertext:tag
 */
export async function encryptField(plaintext: string): Promise<string> {
    if (!plaintext) return plaintext;

    const key = await getKey();
    const encoder = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

    const encrypted = await crypto.subtle.encrypt(
        { name: ALGORITHM, iv },
        key,
        encoder.encode(plaintext)
    );

    // Combine IV + ciphertext into single base64 string
    const combined = new Uint8Array(iv.length + new Uint8Array(encrypted).length);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);

    return btoa(String.fromCharCode(...combined));
}

/**
 * Decrypt a previously encrypted string
 */
export async function decryptField(encrypted: string): Promise<string> {
    if (!encrypted) return encrypted;

    try {
        const key = await getKey();
        const combined = new Uint8Array(
            atob(encrypted).split("").map((c) => c.charCodeAt(0))
        );

        const iv = combined.slice(0, IV_LENGTH);
        const ciphertext = combined.slice(IV_LENGTH);

        const decrypted = await crypto.subtle.decrypt(
            { name: ALGORITHM, iv },
            key,
            ciphertext
        );

        return new TextDecoder().decode(decrypted);
    } catch {
        // If decryption fails, return original (might be unencrypted legacy data)
        return encrypted;
    }
}

/**
 * Check if a value appears to be encrypted (base64-encoded with sufficient length)
 */
export function isEncrypted(value: string): boolean {
    if (!value || value.length < 20) return false;
    try {
        atob(value);
        return true;
    } catch {
        return false;
    }
}
