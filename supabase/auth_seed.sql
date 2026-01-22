-- Create a new user in auth.users table safely
-- We use a DO block to check for existence and avoid ON CONFLICT errors
-- caused by missing unique constraints or partial indexes.

-- 1. Enable pgcrypto if not already
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  new_user_id uuid := gen_random_uuid();
  v_email text := 'admin@compro.com';
  v_password text := 'admin123';
  v_exists boolean;
BEGIN
  -- 2. Check if user exists
  SELECT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) INTO v_exists;
  
  IF NOT v_exists THEN
    -- 3. Insert user
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      new_user_id,
      'authenticated',
      'authenticated',
      v_email,
      crypt(v_password, gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{}',
      now(),
      now(),
      '',
      '',
      '',
      ''
    );

    -- 4. Insert identity
    -- For email provider, provider_id is usually the user_id
    INSERT INTO auth.identities (
      id,
      user_id,
      provider_id,
      identity_data,
      provider,
      last_sign_in_at,
      created_at,
      updated_at
    ) VALUES (
      gen_random_uuid(),
      new_user_id,
      new_user_id::text,
      format('{"sub":"%s","email":"%s"}', new_user_id::text, v_email)::jsonb,
      'email',
      now(),
      now(),
      now()
    );
    
    RAISE NOTICE 'User % created successfully.', v_email;
  ELSE
    RAISE NOTICE 'User % already exists.', v_email;
  END IF;
END $$;
