CREATE TABLE IF NOT EXISTS public.customers
(
    id uuid NOT NULL,
    stripe_customer_id text COLLATE pg_catalog."default",
    CONSTRAINT customers_pkey PRIMARY KEY (id),
    CONSTRAINT customers_id_fkey FOREIGN KEY (id)
        REFERENCES auth.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

ALTER TABLE IF EXISTS public.customers
    OWNER to postgres;

ALTER TABLE IF EXISTS public.customers
    ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.customers TO anon;

GRANT ALL ON TABLE public.customers TO authenticated;

GRANT ALL ON TABLE public.customers TO postgres;

GRANT ALL ON TABLE public.customers TO service_role;
CREATE POLICY "Can read own data"
    ON public.customers
    AS PERMISSIVE
    FOR SELECT
    TO public
    USING ((auth.uid() = id));

CREATE TABLE IF NOT EXISTS public.profiles
(
    id uuid NOT NULL,
    updated_at timestamp with time zone,
    username text COLLATE pg_catalog."default",
    avatar_url text COLLATE pg_catalog."default",
    website text COLLATE pg_catalog."default",
    CONSTRAINT profiles_pkey PRIMARY KEY (id),
    CONSTRAINT profiles_username_key UNIQUE (username),
    CONSTRAINT profiles_id_fkey FOREIGN KEY (id)
        REFERENCES auth.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT username_length CHECK (char_length(username) >= 3)
);

ALTER TABLE IF EXISTS public.profiles
    OWNER to postgres;

ALTER TABLE IF EXISTS public.profiles
    ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.profiles TO anon;

GRANT ALL ON TABLE public.profiles TO authenticated;

GRANT ALL ON TABLE public.profiles TO postgres;

GRANT ALL ON TABLE public.profiles TO service_role;
CREATE POLICY "Public profiles are viewable by everyone."
    ON public.profiles
    AS PERMISSIVE
    FOR SELECT
    TO public
    USING (true);
CREATE POLICY "Users can insert their own profile."
    ON public.profiles
    AS PERMISSIVE
    FOR INSERT
    TO public
    WITH CHECK ((auth.uid() = id));
CREATE POLICY "Users can update own profile."
    ON public.profiles
    AS PERMISSIVE
    FOR UPDATE
    TO public
    USING ((auth.uid() = id));

CREATE TABLE IF NOT EXISTS public.orders
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    stripe_customer_id text COLLATE pg_catalog."default" NOT NULL,
    stripe_pi_id text COLLATE pg_catalog."default" NOT NULL,
    amount numeric NOT NULL,
    currency text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp(3) without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT orders_pkey PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS public.orders
    OWNER to postgres;

GRANT ALL ON TABLE public.orders TO anon;

GRANT ALL ON TABLE public.orders TO authenticated;

GRANT ALL ON TABLE public.orders TO postgres;

GRANT ALL ON TABLE public.orders TO service_role;