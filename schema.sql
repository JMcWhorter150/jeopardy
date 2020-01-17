create table users (
    id serial primary key,
    name text,
    hash text
);

create table gamesLog (
    id serial primary key,
    user_id integer references users (id),
    datePlayed date,
    episodePlayed integer,
    score integer
);

create table stats (
    id serial primary key,
    game_id integer references gamesLog (id),
    questionsCorrectJeopardy integer,
    questionsNotAnsweredJeopardy integer,
    questionsCorrectDoubleJeopardy integer,
    questionsNotAnsweredDoubleJeopardy integer,
    questionsCorrectFinalJeopardy integer
)
