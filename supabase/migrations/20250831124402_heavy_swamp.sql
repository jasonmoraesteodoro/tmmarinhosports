/*
  # Add subscription plans to app_settings

  1. New Columns
    - `subscription_plan` (text, default 'basic') - stores the user's current plan
    - `student_capacity` (integer, default 30) - maximum number of students for the plan
    - `subscription_fee` (numeric, default 49.90) - monthly fee for the plan

  2. Changes
    - Add subscription plan fields to app_settings table
    - Set default values for existing users to Basic plan
*/

-- Add subscription plan columns to app_settings table
DO $$
BEGIN
  -- Add subscription_plan column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'app_settings' AND column_name = 'subscription_plan'
  ) THEN
    ALTER TABLE public.app_settings ADD COLUMN subscription_plan TEXT DEFAULT 'basic';
  END IF;

  -- Add student_capacity column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'app_settings' AND column_name = 'student_capacity'
  ) THEN
    ALTER TABLE public.app_settings ADD COLUMN student_capacity INTEGER DEFAULT 30;
  END IF;

  -- Add subscription_fee column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'app_settings' AND column_name = 'subscription_fee'
  ) THEN
    ALTER TABLE public.app_settings ADD COLUMN subscription_fee NUMERIC(10,2) DEFAULT 49.90;
  END IF;
END $$;

-- Add constraint to ensure valid subscription plans
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'app_settings_subscription_plan_check'
  ) THEN
    ALTER TABLE public.app_settings 
    ADD CONSTRAINT app_settings_subscription_plan_check 
    CHECK (subscription_plan IN ('basic', 'premium'));
  END IF;
END $$;