import { getConfig } from './shared/config.js';
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// We fetch the config and create the client
// To avoid top-level await (for better compatibility), we export a promise
const supabasePromise = getConfig().then(config => {
    return createClient(config.supabaseUrl, config.supabaseAnonKey);
});

/**
 * Helper to get the initialized Supabase client.
 * This ensures that the code waits for the config to be fetched before using the client.
 */
export async function getSupabase() {
    return await supabasePromise;
}

// Legacy export - will work once the promise resolves
// But it's safer to use getSupabase()
export let supabase = null;
supabasePromise.then(client => {
    supabase = client;
    console.log("🚀 Supabase Initialized on Frontend!");
});

/**
 * Reusable helper to upload a file to Supabase Storage
 */
export async function uploadFile(file, bucket, folder = '') {
    try {
        const client = await getSupabase();
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = folder ? `${folder}/${fileName}` : fileName;

        const { data, error } = await client.storage
            .from(bucket)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) throw error;

        const { data: { publicUrl } } = client.storage
            .from(bucket)
            .getPublicUrl(filePath);

        return publicUrl;
    } catch (err) {
        console.error('Upload Error:', err);
        throw err;
    }
}
