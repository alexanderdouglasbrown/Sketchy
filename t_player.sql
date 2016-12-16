CREATE TABLE public.player
(
    id regclass NOT NULL,
    username text COLLATE pg_catalog."default" NOT NULL,
    password text COLLATE pg_catalog."default" NOT NULL,
    icon bytea,
    date_created date NOT NULL,
    CONSTRAINT player_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;