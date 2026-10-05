# Bookstore Architecture Guide

Welcome to the Bookstore project! This document explains how the different pieces of our technology stack work together in simple terms, especially designed for developers new to GraphQL.

## 📋 Table of Contents
1. [The Technology Stack](#-the-technology-stack)
2. [Project Structure](#-project-structure)
3. [Getting Started](#-getting-started)
4. [Understanding GraphQL](#-understanding-graphql)
5. [Understanding Prisma](#-understanding-prisma)
6. [The Data Workflow (Sequence Diagram)](#-the-data-workflow-sequence-diagram)
7. [Try It Yourself](#-try-it-yourself)
8. [Glossary & Further Reading](#-glossary--further-reading)

---

## 🏗️ The Technology Stack

Our application is built using a modern, three-tier architecture:

1. **Frontend (React & Apollo Client):** The user interface where customers browse books and admins manage the store.
2. **Backend (GraphQL API):** The "middleman" that handles requests from the frontend and figures out what data is needed.
3. **Database (PostgreSQL & Prisma):** The digital filing cabinet where all our data (books, users, orders) is safely stored.

---

## 📂 Project Structure

```text
bookstore/
├── bookstore-frontend/         # The React application
│   ├── src/
│   │   ├── components/         # Reusable UI elements (Buttons, Cards, Modals)
│   │   ├── context/            # React Contexts (like CartContext for global state)
│   │   ├── graphql/            # Frontend GraphQL queries and mutations (books.ts, order.ts)
│   │   └── pages/              # Page views (Shop, Home, Admin Dashboard)
│   └── package.json            # Frontend dependencies and scripts (npm run dev)
│
└── bookstore-graphql-api/      # The Node.js GraphQL Backend
    ├── src/
    │   ├── prisma/             # Database connection and schema setup
    │   │   └── schema.prisma   # Defines the PostgreSQL database tables
    │   └── index.ts            # The main server file containing TypeDefs and Resolvers
    └── package.json            # Backend dependencies
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** (v20 or higher recommended)
* **PostgreSQL** database running locally or in the cloud.

### 1. Database & Environment Setup
Currently, there is no `.env.example` file in the repositories, so you will need to create your own `.env` files manually.

In `bookstore-graphql-api/`, create a `.env` file:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/bookstore"
```

In `bookstore-frontend/`, create a `.env` file:
```env
VITE_GRAPHQL_URI="http://localhost:4000/"
```

### 2. Start the Backend
Open a terminal and navigate to the backend folder:
```bash
cd bookstore-graphql-api
npm install
```
Next, push the Prisma schema to your database to create the tables (since this project uses Prisma 8, the `postinstall` script handles client generation):
```bash
npx prisma db push
```
*(If you have a seed script, you can run it via `npx ts-node --esm seed.ts` to populate dummy data).*

Start the server:
```bash
npx ts-node --esm src/index.ts
```
The API is now running at **http://localhost:4000**

### 3. Start the Frontend
Open a new terminal and navigate to the frontend folder:
```bash
cd bookstore-frontend
npm install
npm run dev
```
The app is now running at **http://localhost:5173**

---

## 🔍 Understanding GraphQL

**Why GraphQL?** In traditional REST APIs, hitting an endpoint like `/api/books` gives you a fixed "combo meal" of data. If you only want the book titles, but the server sends back the title, price, author, description, and 50 reviews, you waste bandwidth downloading data you didn't need. This is called **over-fetching**. 

GraphQL fixes this by acting like a smart buffet where you hand the chef an exact list of what you want, and you get exactly that—nothing more, nothing less.

Here are the four main building blocks of our GraphQL setup, complete with real code from this project:

### 1. TypeDefs (The Contract / The Menu)
**TypeDefs** (Type Definitions) are the blueprints of our API data. They define exactly what objects exist and what fields they have using GraphQL types like `ID`, `String`, `Int`, and `Float`. It's the strict contract between the frontend and backend.

*Real example from `bookstore-graphql-api/src/index.ts`:*
```graphql
type Book {
    id: ID!
    title: String!
    description: String
    price: Float!
    stock: Int!
    imageUrl: String
    publishYear: Int!
    featured: Boolean!
    createdAt: String!
    updatedAt: String!
    authorId: Int!
    categoryId: Int
    author: Author!
    category: Category
    reviews: [Review!]!
    orderItems: [OrderItem!]!
}
```

### 2. Queries (Reading Data)
A **Query** is how the frontend asks the backend to *read* or *fetch* data.

*Real example from `bookstore-frontend/src/graphql/books.ts`:*
```graphql
query GetBooks {
    books {
        id
        title
        price
    }
}
```
**JSON Response:**
```json
{
  "data": {
    "books": [
      { "id": "1", "title": "The Great Gatsby", "price": 15.99 },
      { "id": "2", "title": "1984", "price": 12.50 }
    ]
  }
}
```

If we suddenly decide we also need the stock count, we just add one word to our query:
```graphql
query GetBooks {
    books {
        id
        title
        price
        stock
    }
}
```
**New JSON Response:**
```json
{
  "data": {
    "books": [
      { "id": "1", "title": "The Great Gatsby", "price": 15.99, "stock": 42 },
      { "id": "2", "title": "1984", "price": 12.50, "stock": 15 }
    ]
  }
}
```

### 3. Mutations (Writing Data)
A **Mutation** is how the frontend asks the backend to *change* data—like creating, updating, or deleting something.

*Real example from `bookstore-frontend/src/graphql/books.ts`:*
```graphql
mutation AddBook($title: String!, $price: Float!, $publishYear: Int!, $authorId: Int!) {
    addBook(
        title: $title
        price: $price
        publishYear: $publishYear
        authorId: $authorId
    ) {
        id
        title
    }
}
```

### 4. Resolvers (The Chefs)
When a Query or Mutation comes in, GraphQL needs to know *how* to actually get or change that data. **Resolvers** are the backend JavaScript functions that execute the logic. They are the "chefs" that look at the order and go to the pantry (the database) to get the ingredients.

*Real example from `bookstore-graphql-api/src/index.ts`:*
```typescript
Mutation: {
    addBook: (
        _: unknown,
        { title, price, publishYear, authorId, description, stock, imageUrl, featured, categoryId }
    ) => prisma.orm.public.Book.create({
        title,
        price: String(price),
        publishYear,
        authorId,
        ...(description !== undefined && { description }),
        ...(stock !== undefined && { stock }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(featured !== undefined && { featured }),
        ...(categoryId !== undefined && { categoryId }),
    }),
}
```

---

## 🗄️ Understanding Prisma

Databases speak their own complex language called SQL. Writing raw SQL can be tedious and prone to human error. 

**Prisma** is our translator (an Object-Relational Mapper or ORM) used inside our GraphQL Resolvers. Instead of writing raw SQL strings, backend developers write simple TypeScript commands like `prisma.book.create()`. Prisma safely translates those commands into optimized SQL, talks to PostgreSQL, and hands the data back to us as clean JavaScript objects.

### Prisma Schema vs GraphQL TypeDefs
It's easy to confuse these two. 
* **Prisma Schema (`schema.prisma`):** Defines the exact shape of the tables in your PostgreSQL database (e.g., using relational foreign keys like `authorId`).
* **GraphQL TypeDefs:** Defines the shape of the API exposed to the frontend (e.g., nesting full `Author` objects inside `Book` objects).

The **Resolvers** act as the bridge between the two, grabbing raw relational rows via Prisma and assembling them into the nested shape GraphQL promised the frontend.

---

## 🔌 Apollo Client

If GraphQL is the language we speak, **Apollo Client** is the smartphone we use to make the call. 

Instead of writing complex `fetch()` requests manually in React, we use Apollo Client on the frontend. It provides simple React hooks like `useQuery()` and `useMutation()`.
* **Smart Caching:** When you fetch a list of books, Apollo saves it in memory. If you go to another page and come back, it instantly loads from the cache instead of asking the database again.
* **State Management:** It automatically tracks if a request is `loading`, if there is an `error`, or if the `data` is ready, saving us from writing dozens of boilerplate variables.

---

## 🔄 The Data Workflow (Sequence Diagram)

Here is a step-by-step visual representation of what happens when a user clicks on a book to view its details.

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Frontend as "React (Frontend)"
    participant Apollo as "Apollo Client"
    participant Server as "GraphQL Server"
    participant Prisma as "Prisma ORM"
    participant DB as "PostgreSQL DB"

    User->>Frontend: Clicks on "View Book Details"
    Frontend->>Apollo: Request data via useQuery()
    Apollo->>Server: Send GraphQL Query over HTTP
    
    Note over Server,Prisma: The Resolver receives the Query and asks Prisma to fetch it.
    
    Server->>Prisma: Call prisma.orm.public.Book.where({ id: 1 }).first()
    Prisma->>DB: Execute translated SQL Query
    DB-->>Prisma: Return raw database rows
    Prisma-->>Server: Return formatted TypeScript object
    
    Note over Apollo,Server: Server filters the object to match exactly what GraphQL requested.
    
    Server-->>Apollo: Return JSON payload
    Apollo-->>Frontend: Update application state (loading: false)
    Frontend-->>User: Display Book Details on screen
```

---

## 🛠️ Try It Yourself

You don't need the frontend to test the backend! GraphQL comes with a built-in playground called **Apollo Sandbox**.

1. Start your backend server (`npx ts-node --esm src/index.ts`).
2. Open your browser and go to **[http://localhost:4000](http://localhost:4000)**.
3. You will see the Apollo Sandbox interface.
4. **Run a Query:** Paste this into the Operations panel and click the run button:
   ```graphql
   query {
     books {
       title
       price
     }
   }
   ```
5. **Run a Mutation:** Paste this to create a new category:
   ```graphql
   mutation {
     addCategory(name: "Graphic Novels") {
       id
       name
     }
   }
   ```

---

## 📚 Glossary & Further Reading

* **Schema**: The blueprint of your database (Prisma) or API (GraphQL).
* **Type**: An object definition in GraphQL (e.g., `type Book`).
* **Query**: A GraphQL request to read data.
* **Mutation**: A GraphQL request to write, update, or delete data.
* **Resolver**: The backend function that fetches the data for a specific field or Query/Mutation.
* **Apollo Client**: The frontend library that manages fetching, caching, and state for GraphQL.
* **ORM (Object-Relational Mapper)**: A tool (like Prisma) that translates code into database SQL queries.

**Further Reading:** Want to learn more? Check out the official beginner's guide at [graphql.org/learn](https://graphql.org/learn/).
