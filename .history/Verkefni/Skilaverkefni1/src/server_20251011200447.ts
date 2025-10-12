import express from 'express';

import { errorHandler } from './middleware/errorHandler.js';
import articleRoutes from './routes/articles.js';
import authorRoutes from './routes/authors.js';

const app = express();

app.use(express.json());

// Routes
app.use('/api/articles', articleRoutes);
app.use('/api/authors', authorRoutes);

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

// ### Articles

app.get();

// | GET    | `/api/articles`     | Get all articles   |
// | GET    | `/api/articles/:id` | Get article by ID  |
// | POST   | `/api/articles`     | Create new article |
// | DELETE | `/api/articles/:id` | Delete article     |

// ### Authors

// | Method | Endpoint                    | Description            |
// | ------ | --------------------------- | ---------------------- |
// | GET    | `/api/authors`              | Get all authors        |
// | GET    | `/api/authors/:id`          | Get author by ID       |
// | GET    | `/api/authors/:id/articles` | Get articles by author |
// | POST   | `/api/authors`              | Create new author      |
// | DELETE | `/api/authors/:id`          | Delete author          |

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
