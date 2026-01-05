-- Clear all tables first
TRUNCATE booking_items,
bookings,
tickets,
events,
venues,
categories,
users RESTART IDENTITY CASCADE;

----------------------------------------------
-- USERS (1 user for testing authentication)
----------------------------------------------
INSERT INTO
    users (name, email, password_hash)
VALUES
    (
        'Alice Tester',
        'alice@example.com',
        '$2b$10$v0JVVfC/keq1tLtXoHvziOO5OjQ8WcFZa0XxAFHILV2bsQrbNMLlK'
    );

-- password = "test1234" (pre-hashed)
----------------------------------------------
-- VENUES
----------------------------------------------
INSERT INTO
    venues (name, address)
VALUES
    ('Harpa', 'Austurbakki 2, Reykjavík'),
    ('Laugardalshöll', 'Engjavegur 8, Reykjavík'),
    ('Gamla Bíó', 'Ingólfsstræti 2, Reykjavík');

----------------------------------------------
-- CATEGORIES
----------------------------------------------
INSERT INTO
    categories (name)
VALUES
    ('Tónleikar'),
    ('Íþróttir'),
    ('Leikhús');

----------------------------------------------
-- EVENTS
----------------------------------------------
INSERT INTO
    events (
        title,
        description,
        event_date,
        category_id,
        venue_id
    )
VALUES
    (
        'Sigur Rós Live',
        'Atmospheric Icelandic post-rock concert.',
        '2025-06-20 20:00:00',
        1,
        1
    ),
    (
        'Handbolti: Ísland vs Noregur',
        'International friendly handball match.',
        '2025-07-02 18:00:00',
        2,
        2
    ),
    (
        'Romeo & Juliet',
        'Classic Shakespeare tragedy performance.',
        '2025-08-15 19:30:00',
        3,
        3
    );

----------------------------------------------
-- TICKETS
----------------------------------------------
INSERT INTO
    tickets (price, stock, event_id)
VALUES
    (8990, 100, 1),
    (5990, 150, 2),
    (7490, 80, 3);

----------------------------------------------
-- OPTIONAL: BOOKINGS (none by default)
----------------------------------------------
-- Use these only if you need booking tests later:
-- 
-- INSERT INTO bookings (user_id, event_id)
-- VALUES (1, 1);
-- 
-- INSERT INTO booking_items (booking_id, ticket_id, quantity)
-- VALUES (1, 1, 2);