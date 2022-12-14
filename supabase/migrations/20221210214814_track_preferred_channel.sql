-- This script was generated by the Schema Diff utility in pgAdmin 4
-- For the circular dependencies, the order in which Schema Diff writes the objects is not very sophisticated
-- and may require manual changes to the script to ensure changes are applied in the correct order.
-- Please report an issue for any failure with the reproduction steps.

ALTER TABLE IF EXISTS public.profiles DROP COLUMN IF EXISTS first_name;

ALTER TABLE IF EXISTS public.profiles DROP COLUMN IF EXISTS full_name;

ALTER TABLE IF EXISTS public.profiles DROP COLUMN IF EXISTS last_name;

ALTER TABLE public.profiles
    ALTER COLUMN updated_at TYPE timestamp with time zone ;
ALTER TABLE IF EXISTS public.profiles
    ALTER COLUMN updated_at SET DEFAULT now();

ALTER TABLE IF EXISTS public.profiles
    ALTER COLUMN updated_at DROP NOT NULL;

ALTER TABLE IF EXISTS public.profiles
    ADD COLUMN message_channel_preference text COLLATE pg_catalog."default";
