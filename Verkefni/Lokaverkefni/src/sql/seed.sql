TRUNCATE booking_items,
bookings,
tickets,
events,
venues,
categories,
users RESTART IDENTITY CASCADE;

-- Test seed
-- Event dates use NOW() +/- intervals so tests remain valid
-- regardless of when the seed is executed.
INSERT INTO
    categories (name)
VALUES
    ('Concert'),
    ('Theatre');

INSERT INTO
    venues (name, address, city)
VALUES
    ('Test Venue A', 'Some street 1', 'Reykjavík'),
    ('Test Venue B', 'Other street 2', 'Reykjavík');

-- Events:
-- 1) future (>24h): should allow booking + cancellation
-- 2) past: booking should fail
-- 3) future (<24h): cancellation should fail
-- 4) future: low stock scenario
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
        'Happy-path booking + cancel',
        NOW() + INTERVAL '10 days',
        1,
        1
    ),
    (
        'Past Event',
        'Booking blocked (past date)',
        NOW() - INTERVAL '10 days',
        2,
        1
    ),
    (
        'Future Event 12 hours',
        'Cancel blocked (<24h)',
        NOW() + INTERVAL '12 hours',
        1,
        2
    ),
    (
        'Future Event low stock',
        'Not enough stock scenario',
        NOW() + INTERVAL '5 days',
        2,
        2
    );

INSERT INTO
    tickets (event_id, price, stock)
VALUES
    (1, 5000, 50),
    (2, 4000, 50),
    (3, 6000, 50),
    (4, 7000, 1),
    (1, 9999, 10);