import { getConfig } from './shared/config.js';
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const { supabaseUrl, supabaseAnonKey } = await getConfig();

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Reusable helper to upload a file to Supabase Storage
 * @param {File} file - The file object from <input type="file">
 * @param {string} bucket - The bucket name (e.g. 'produce-images', 'profiles')
 * @param {string} folder - Optional subfolder (e.g. user ID)
 * @returns {Promise<string>} - The public URL of the uploaded file
 */
export async function uploadFile(file, bucket, folder = '') {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = folder ? `${folder}/${fileName}` : fileName;

        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) throw error;

        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

        return publicUrl;
    } catch (err) {
        console.error('Upload Error:', err);
        throw err;
    }
}

console.log("🚀 Supabase Initialized on Frontend!");
