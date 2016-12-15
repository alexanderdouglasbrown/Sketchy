CREATE SEQUENCE public.wordlist_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

CREATE TABLE public.wordlist
(
    id integer NOT NULL DEFAULT nextval('public.wordlist_id_seq'::regclass),
    word text COLLATE pg_catalog."default" NOT NULL,
    category text COLLATE pg_catalog."default",
    CONSTRAINT wordlist_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;