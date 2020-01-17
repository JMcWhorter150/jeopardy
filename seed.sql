insert into users 
        (name, hash)
    values
        ('bentley', '$2a$10$o5aycnAEos8IC.Xqna3NPu.8uyQ83AJdPlaXRTg4Ka7vcUHTu7Dq6'),
        -- testUser1 password is 'password
        ('joe', '$2a$10$NLix9sQzNo0UjD04vaq/CeIGQcxxHVI9F0ezsY1nScgdPLcPQE4x.'),
        -- testUser2 password is '123123'
        ('david', '$2a$10$NLix9sQzNo0UjD04vaq/CeIGQcxxHVI9F0ezsY1nScgdPLcPQE4x.');

insert into gamesLog 
        (user_id, datePlayed, episodePlayed, score)
    values 
        (1, '2020-01-15', 4680, 1234),
        (2, '2020-01-10', 5957, 2345),
        (1, '2020-02-15', 1239, 3456),
        (2, '2020-03-10', 1029, 4567),
        (1, '2020-04-15', 8438, 5678),
        (2, '2020-05-10', 7438, 7890),
        (1, '2020-06-15', 0342, 9876),
        (2, '2020-07-10', 4324, 8765),
        (1, '2020-08-15', 0987, 7654),
        (2, '2020-09-10', 1483, 6543),
        (1, '2020-01-10', 5957, 5432),
        (2, '2020-01-10', 5957, 4321),
        (1, '2020-01-10', 5957, 3211),
        (2, '2020-01-10', 5957, 1234),
        (1, '2020-01-10', 5957, 2345),
        (2, '2020-01-10', 5957, 3456),
        (1, '2020-01-10', 5957, 4567),
        (2, '2020-01-10', 5957, 5678);


insert into stats
        (game_id, questionsCorrectJeopardy, questionsNotAnsweredJeopardy, questionsCorrectDoubleJeopardy, questionsNotAnsweredDoubleJeopardy, questionsCorrectFinalJeopardy)
    values 
        (1, 20, 10, 5, 25, 1),
        (2, 10, 20, 10, 20, 1),
        (3, 5, 25, 15, 15, 1),
        (4, 15, 15, 10, 20, 0);


