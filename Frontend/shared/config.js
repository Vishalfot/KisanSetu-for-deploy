// Frontend/shared/config.js
// This file centralizes the loading of public API keys from the backend.
// It avoids hardcoding secrets in the frontend source code.

let cachedConfig = null;

/**
 * Fetches the public configuration (API keys) from the server.
 * @returns {Promise<{supabaseUrl: string, supabaseAnonKey: string, razorpayKeyId: string, geminiApiKey: string}>}
 */
export async function getConfig() {
    if (cachedConfig) return cachedConfig;

    try {
        const response = await fetch('/api/config/keys');
        if (!response.ok) {
            throw new Error(`Failed to fetch config: ${response.statusText}`);
        }
        cachedConfig = await response.json();
        return cachedConfig;
    } catch (error) {
        console.error('Error loading configuration:', error);
        // Fallback to empty strings if the server fails to prevent hard crashes
        return {
            supabaseUrl: '',
            supabaseAnonKey: '',
            razorpayKeyId: '',
            geminiApiKey: ''
        };
    }
}
