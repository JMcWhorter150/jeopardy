insert into users 
        (name, hash)
    values
        ('bentley', '$2a$10$o5aycnAEos8IC.Xqna3NPu.8uyQ83AJdPlaXRTg4Ka7vcUHTu7Dq6'),
        -- testUser1 password is 'password'
        ('joe', '$2a$10$NLix9sQzNo0UjD04vaq/CeIGQcxxHVI9F0ezsY1nScgdPLcPQE4x.'),
        -- testUser2 password is '123123'
        ('david', '$2a$10$NLix9sQzNo0UjD04vaq/CeIGQcxxHVI9F0ezsY1nScgdPLcPQE4x.');

insert into gamesLog 
        (winner_id, datePlayed, episodePlayed)
    values 
        (1, '2020-01-15', 4680),
        (2, '2020-01-10', 5957),
        (1, '2020-01-10', 5957),
        (2, '2020-01-10', 5957),
        (1, '2020-01-10', 5957),
        (2, '2020-01-10', 5957),
        (1, '2020-01-10', 5957),
        (2, '2020-01-10', 5957),
        (1, '2020-01-10', 5957),
        (2, '2020-01-10', 5957);


insert into scores
        (user_id, game_id, score)
    values 
        (1, 1, '1234'),
        (2, 2, '3456'),
        (1, 3, '4567'),
        (2, 4, '5678'),
        (3, 5, '6789'),
        (2, 6, '12340'),
        (1, 7, '34560'),
        (3, 8, '45670'),
        (1, 9, '56780'),
        (1, 10, '67890');

