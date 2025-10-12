# 📋 Expected API Responses - Implementation Guide

This document outlines the exact responses that are expected for each endpoint.

---

## 📊 Data Structure

### **Authors Data (authors.json)**

```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "bio": "Software developer and writer"
  }
]
```

### **Articles Data (articles.json)**

```json
[
  {
    "id": 1,
    "title": "Learning TypeScript",
    "content": "TypeScript adds static typing to JavaScript...",
    "authorId": 1
  }
]
```

---

## 🔧 Required Schemas

### **Author Schema**

```typescript
  name: string, required, max 100 characters,
  email: string, email,
  bio: string, optional,
```

### **Article Schema**

```typescript
  title: string, required, max 100 characters,
  content: string, min 10 characters,
  authorId: number, must be a positive number,
```

---

## 📖 API Endpoints

### Articles

| Method | Endpoint            | Description        |
| ------ | ------------------- | ------------------ |
| GET    | `/api/articles`     | Get all articles   |
| GET    | `/api/articles/:id` | Get article by ID  |
| POST   | `/api/articles`     | Create new article |
| DELETE | `/api/articles/:id` | Delete article     |

### Authors (Extended)

| Method | Endpoint                    | Description            |
| ------ | --------------------------- | ---------------------- |
| GET    | `/api/authors`              | Get all authors        |
| GET    | `/api/authors/:id`          | Get author by ID       |
| GET    | `/api/authors/:id/articles` | Get articles by author |
| POST   | `/api/authors`              | Create new author      |
| DELETE | `/api/authors/:id`          | Delete author          |

## 📚 Authors Endpoints

### **GET /api/authors**

**Success Response (200):**

```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "bio": "Software developer and writer"
  },
  {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "bio": "Tech blogger"
  }
]
```

**Error Response (500):**

```json
{
  "success": false,
  "message": "Server Error"
}
```

### **GET /api/authors/:id**

**Success Response (200):**

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "bio": "Software developer and writer"
}
```

**Not Found Response (404):**

```json
{
  "error": {
    "status": 404,
    "message": "Author not found"
  }
}
```

### **POST /api/authors**

**Request Body:**

```json
{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "bio": "Tech writer and developer"
}
```

**Success Response (201):**

```json
{
  "id": 3,
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "bio": "Tech writer and developer"
}
```

**Validation Error Response (400):**

```json
{
  "error": {
    "status": 400,
    "message": "Validation failed",
    "details": [
      {
        "field": "name",
        "message": "Name is required"
      },
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### **GET /api/authors/:id/articles**

**Success Response (200):**

```json
[
  {
    "id": 1,
    "title": "Learning TypeScript",
    "content": "TypeScript adds static typing to JavaScript...",
    "authorId": 1
  },
  {
    "id": 3,
    "title": "Advanced TypeScript",
    "content": "Deep dive into TypeScript features...",
    "authorId": 1
  }
]
```

**Success Response - No Articles (200):**

```json
[]
```

**Author Not Found Response (404):**

```json
{
  "error": {
    "status": 404,
    "message": "Author not found"
  }
}
```

### **DELETE /api/authors/:id**

**Success Response (200):**

```json
{
  "message": "Author deleted successfully"
}
```

**Not Found Response (404):**

```json
{
  "error": {
    "status": 404,
    "message": "Author not found"
  }
}
```

---

## 📰 Articles Endpoints

### **GET /api/articles**

**Success Response (200):**

```json
[
  {
    "id": 1,
    "title": "Learning TypeScript",
    "content": "TypeScript adds static typing to JavaScript...",
    "authorId": 1
  },
  {
    "id": 2,
    "title": "Express.js Best Practices",
    "content": "Building robust APIs with Express...",
    "authorId": 2
  }
]
```

### **GET /api/articles/:id**

**Success Response (200):**

```json
{
  "id": 1,
  "title": "Learning TypeScript",
  "content": "TypeScript adds static typing to JavaScript...",
  "authorId": 1
}
```

**Not Found Response (404):**

```json
{
  "error": {
    "status": 404,
    "message": "Article not found"
  }
}
```

### **GET /api/articles/authors/:id**

**Success Response (200):**

```json
{
  "id": 1,
  "title": "Learning TypeScript",
  "content": "TypeScript adds static typing to JavaScript...",
  "authorId": 1
}
```

**Not Found Response (404):**

```json
{
  "error": {
    "status": 404,
    "message": "Article not found"
  }
}
```

### **POST /api/articles**

**Request Body:**

```json
{
  "title": "Getting Started with Node.js",
  "content": "Node.js is a JavaScript runtime built on Chrome's V8 engine...",
  "authorId": 1
}
```

**Success Response (201):**

```json
{
  "id": 3,
  "title": "Getting Started with Node.js",
  "content": "Node.js is a JavaScript runtime built on Chrome's V8 engine...",
  "authorId": 1
}
```

**Validation Error Response (400):**

```json
{
  "error": {
    "status": 400,
    "message": "Validation failed",
    "details": [
      {
        "field": "title",
        "message": "Title is required"
      },
      {
        "field": "content",
        "message": "Content must be at least 10 characters"
      },
      {
        "field": "authorId",
        "message": "Author ID must be positive"
      }
    ]
  }
}
```

### **DELETE /api/articles/:id**

**Success Response (200):**

```json
{
  "message": "Article deleted successfully"
}
```

**Not Found Response (404):**

```json
{
  "error": {
    "status": 404,
    "message": "Article not found"
  }
}
```

---

## 🧪 Test Cases To Be Handled

### **Validation Test Cases**

1. **Missing required fields**
2. **Empty strings for required fields**
3. **Invalid email format**
4. **String length violations**
5. **Invalid data types**
6. **Negative or zero authorId**

### **Error Handling Test Cases**

1. **Non-existent resource IDs (404)**
2. **File system errors (500)**
3. **Invalid JSON in request body**
4. **Server crashes/exceptions**

### **Success Path Test Cases**

1. **Create resources with valid data**
2. **Retrieve all resources**
3. **Retrieve specific resources by ID**
4. **Delete existing resources**
5. **Proper status codes and response formats**

---

## 🎯 Grading Criteria

The following criteria will be graded:

1. **Correct HTTP status codes**
2. **Proper error response formats**
3. **Validation implementation**
4. **Data persistence**
5. **TypeScript usage**
6. **Code organization**
7. **Error handling patterns**
