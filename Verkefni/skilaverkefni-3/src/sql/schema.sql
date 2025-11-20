CREATE TABLE cuisines (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE recipes (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    cook_time_minutes INTEGER,
    difficulty VARCHAR(50),
    rating DECIMAL(3, 1) CHECK (
        rating >= 0
        AND rating <= 5
    ),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    cuisine_id BIGINT NOT NULL,
    FOREIGN KEY (cuisine_id) REFERENCES cuisines(id) ON DELETE CASCADE
);