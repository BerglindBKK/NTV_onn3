-- Clear all tables first
TRUNCATE booking_items,
bookings,
tickets,
events,
venues,
categories,
users RESTART IDENTITY CASCADE;

-- -----------------------
-- Categories (id: 1..)
-- -----------------------
INSERT INTO
    categories (name)
VALUES
    ('Concert'),
    ('Theatre');

-- -----------------------
-- Venues (id: 1..)
-- -----------------------
INSERT INTO
    venues (name, address, city)
VALUES
    ('Test Venue A', 'Some street 1', 'Reykjavík'),
    ('Test Venue B', 'Other street 2', 'Reykjavík');

-- -----------------------
-- Events (id: 1..)
-- -----------------------
-- 1) FUTURE event >24h (good for booking + cancel allowed)
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
        'Future Event 10 days',
        'Used for success booking & cancel allowed',
        NOW() + INTERVAL '10 days',
        1,
        1
    );

-- 2) PAST event (booking should fail: "Event is in the past")
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
        'Past Event',
        'Used for past-event rule',
        NOW() - INTERVAL '10 days',
        2,
        1
    );

-- 3) FUTURE event within 24h (cancel should fail)
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
        'Future Event 12 hours',
        'Used for cancel forbidden rule',
        NOW() + INTERVAL '12 hours',
        1,
        2
    );

-- 4) FUTURE event with LOW stock (not enough tickets test)
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
        'Future Event low stock',
        'Used for not-enough-stock rule',
        NOW() + INTERVAL '5 days',
        2,
        2
    );

-- -----------------------
-- Tickets (id: 1..)
-- columns: (event_id, price, stock)
-- -----------------------
-- Tickets for Event 1 (success + cancel allowed)
INSERT INTO
    tickets (event_id, price, stock)
VALUES
    (1, 5000, 50);

-- ticket_id 1
-- Tickets for Event 2 (past event)
INSERT INTO
    tickets (event_id, price, stock)
VALUES
    (2, 4000, 50);

-- ticket_id 2
-- Tickets for Event 3 (within 24h)
INSERT INTO
    tickets (event_id, price, stock)
VALUES
    (3, 6000, 50);

-- ticket_id 3
-- Tickets for Event 4 (low stock)
INSERT INTO
    tickets (event_id, price, stock)
VALUES
    (4, 7000, 1);

-- ticket_id 4 (not enough if quantity >= 2)
-- Extra ticket for mismatch test:
-- A ticket that belongs to Event 1, used when you send event_id=4 with ticket_id=5 (should fail)
INSERT INTO
    tickets (event_id, price, stock)
VALUES
    (1, 9999, 10);

-- ticket_id 5
-- ----------------------------------------------
-- -- USERS (1 user for testing authentication)
-- ----------------------------------------------
-- INSERT INTO
--     users (name, email, password_hash)
-- VALUES
--     (
--         'Alice Tester',
--         'alice@example.com',
--         '$2b$10$v0JVVfC/keq1tLtXoHvziOO5OjQ8WcFZa0XxAFHILV2bsQrbNMLlK'
--     );
-- -- password = "test1234" (pre-hashed)
-- ----------------------------------------------
-- -- VENUES
-- ----------------------------------------------
-- INSERT INTO
--     venues (name, address)
-- VALUES
--     ('Harpa', 'Austurbakki 2, Reykjavík'),
--     ('Laugardalshöll', 'Engjavegur 8, Reykjavík'),
--     ('Gamla Bíó', 'Ingólfsstræti 2, Reykjavík');
-- ----------------------------------------------
-- -- CATEGORIES
-- ----------------------------------------------
-- INSERT INTO
--     categories (name)
-- VALUES
--     ('Tónleikar'),
--     ('Íþróttir'),
--     ('Leikhús');
-- ----------------------------------------------
-- -- EVENTS
-- ----------------------------------------------
-- INSERT INTO
--     events (
--         title,
--         description,
--         event_date,
--         category_id,
--         venue_id
--     )
-- VALUES
--     (
--         'Sigur Rós Live',
--         'Atmospheric Icelandic post-rock concert.',
--         '2025-06-20 20:00:00',
--         1,
--         1
--     ),
--     (
--         'Handbolti: Ísland vs Noregur',
--         'International friendly handball match.',
--         '2025-07-02 18:00:00',
--         2,
--         2
--     ),
--     (
--         'Romeo & Juliet',
--         'Classic Shakespeare tragedy performance.',
--         '2025-08-15 19:30:00',
--         3,
--         3
--     );
-- ----------------------------------------------
-- -- TICKETS
-- ----------------------------------------------
-- INSERT INTO
--     tickets (price, stock, event_id)
-- VALUES
--     (8990, 100, 1),
--     (5990, 150, 2),
--     (7490, 80, 3);
-- ----------------------------------------------
-- -- OPTIONAL: BOOKINGS (none by default)
-- ----------------------------------------------
-- -- Use these only if you need booking tests later:
-- -- 
-- -- INSERT INTO bookings (user_id, event_id)
-- -- VALUES (1, 1);
-- -- 
-- -- INSERT INTO booking_items (booking_id, ticket_id, quantity)
-- -- VALUES (1, 1, 2);