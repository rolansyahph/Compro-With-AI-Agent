import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple .env parser
function loadEnv() {
  try {
    const envPath = path.resolve(__dirname, '../.env');
    if (!fs.existsSync(envPath)) {
      console.warn('Warning: .env file not found.');
      return {};
    }
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const env = {};
    envContent.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, '');
        env[key] = value;
      }
    });
    return env;
  } catch (error) {
    console.error('Error reading .env file:', error);
    return {};
  }
}

const env = loadEnv();
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing in .env file.');
  console.log('Please make sure you have added these variables to your .env file.');
  console.log('You can find the Service Role Key in your Supabase Project Settings > API.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdminUser() {
  const email = 'admin@compro.com';
  const password = 'admin123';

  console.log(`Attempting to create user: ${email}`);

  // Check if user exists
  // Note: List users requires service role key
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
  
  if (listError) {
    console.error('Error listing users:', listError.message);
    return;
  }

  const existingUser = users.find(u => u.email === email);

  if (existingUser) {
    console.log('User already exists. Updating password...');
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      existingUser.id,
      { password: password, email_confirm: true }
    );

    if (updateError) {
      console.error('Error updating user:', updateError.message);
    } else {
      console.log('User password updated successfully.');
      console.log(`Login with: ${email} / ${password}`);
    }
  } else {
    console.log('Creating new user...');
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (error) {
      console.error('Error creating user:', error.message);
    } else {
      console.log('User created successfully!');
      console.log(`Login with: ${email} / ${password}`);
    }
  }
}

createAdminUser();
