create table users (
    id serial primary key,
    name text,
    hash text
);

create table gamesLog (
    id serial primary key,
    winner_id integer references users (id),
    datePlayed date,
    episodePlayed integer,
    score integer
);

create table scores (
    id serial primary key,
    -- user_id may be a built in name
    -- using player_id instead.
    user_id integer references users (id),
    game_id integer references gamesLog (id),
    score integer
);
