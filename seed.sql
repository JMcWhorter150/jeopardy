insert into users 
        (name, hash)
    values
        ('testUser1', '$2a$10$o5aycnAEos8IC.Xqna3NPu.8uyQ83AJdPlaXRTg4Ka7vcUHTu7Dq6'),
        -- testUser1 password is 'password'
        ('testUser2', '$2a$10$NLix9sQzNo0UjD04vaq/CeIGQcxxHVI9F0ezsY1nScgdPLcPQE4x.')
        -- testUser2 password is '123123'
;

insert into gamesLog 
        (winner_id, datePlayed, episodePlayed)
    values 
        (1, '2020-01-15', 4680),
        (2, '2020-01-10', 5957),
        (1, '2020-02-15', 1239),
        (2, '2020-03-10', 1029),
        (1, '2020-04-15', 8438),
        (2, '2020-05-10', 7438),
        (1, '2020-06-15', 0342),
        (2, '2020-07-10', 4324),
        (1, '2020-08-15', 0987),
        (2, '2020-09-10', 1483)
;

insert into scores
        (user_id, game_id, score)
    values 
        (1, 1, '1234')
;