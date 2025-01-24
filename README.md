## Prisma

### What is an ORM?
An ORM (Object-Relational Mapping) tool allows developers to interact with a database using an object-oriented paradigm instead of writing raw SQL queries. ORMs map database tables to classes and rows to objects. Examples of ORMs include Prisma, Sequelize, and TypeORM. Prisma stands out as it combines ORM functionality with a focus on modern development workflows and type safety.

### What is Prisma?
Prisma is a modern database toolkit that simplifies database access and management. It provides an abstraction over SQL, enabling developers to work with their database using a type-safe and auto-completed API. Prisma consists of three main components:

1. **Prisma Client**: A type-safe query builder for your database.
2. **Prisma Migrate**: A tool for managing schema migrations.
3. **Prisma Studio**: A GUI for exploring and managing your database.

---

### 1. Initial Setup
- Install Prisma CLI and necessary packages:
  ```bash
  npm install prisma --save-dev
  npm install @prisma/client
  ```
- Initialize Prisma:
  ```bash
  npx prisma init
  ```
- In `prisma/schema.prisma`, set the datasource to PostgreSQL:
  ```prisma
  datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
  }
  
generator client {
    provider = "prisma-client-js"
  }
  ```
- Add your PostgreSQL connection string to `.env`:
  ```env
  DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
  ```

### 2. Defining the Schema
- Example of a simple `User` model:
  ```prisma
  model User {
    id        Int      @id @default(autoincrement())
    email     String   @unique
    name      String
    createdAt DateTime @default(now())
  }
  ```
- Relations example with `Post`:
  ```prisma
  model Post {
    id        Int      @id @default(autoincrement())
    title     String
    content   String?
    published Boolean  @default(false)
    authorId  Int
    author    User     @relation(fields: [authorId], references: [id])
  }
  ```

### 3. Running Migrations
- Create and apply migrations:
  ```bash
  npx prisma migrate dev --name init
  ```
- View the generated migration SQL in the `prisma/migrations` folder.

### 4. Seeding the Database
- Add a `prisma/seed.js` or `seed.ts` file:
  ```javascript
  import { PrismaClient } from "@prisma/client";

  const prisma = new PrismaClient();

  async function main() {
    await prisma.user.create({
      data: {
        email: "example@example.com",
        name: "Example User",
      },
    });
  }

  main()
    .catch((e) => console.error(e))
    .finally(async () => {
      await prisma.$disconnect();
    });
  ```
- Run the seeding script:
  ```bash
  npx prisma db seed
  ```

### 5. Querying the Database
- Instantiate the Prisma Client:
  ```javascript
  import { PrismaClient } from "@prisma/client";

  const prisma = new PrismaClient();
  ```
- Example queries:
  ```javascript
  // Fetch all users
  const users = await prisma.user.findMany();

  // Create a new post
  const post = await prisma.post.create({
    data: {
      title: "My First Post",
      content: "This is the content",
      published: true,
      author: {
        connect: { id: 1 },
      },
    },
  });
  ```

### 6. Prisma Studio
- Launch Prisma Studio for a visual database interface:
  ```bash
  npx prisma studio
  ```

### 7. Using PostgreSQL-Specific Features
- **UUIDs**:
  ```prisma
  model Example {
    id   String @id @default(uuid())
    name String
  }
  ```
- **JSON Fields**:
  ```prisma
  model Example {
    id       Int    @id @default(autoincrement())
    metadata Json
  }
  ```
- **Full-Text Search**:
  PostgreSQL supports full-text search; integrate it using raw SQL:
  ```javascript
  const results = await prisma.$queryRaw`
    SELECT * FROM "Post" WHERE to_tsvector('english', title || ' ' || content) @@ to_tsquery('example')
  `;
  ```

### 8. Best Practices
- Use the Prisma Client in a singleton pattern to avoid multiple connections.
- Regularly run `npx prisma format` to keep the schema clean.
- Leverage `.env` files for sensitive configurations.

### 9. Deployment
- Generate the Prisma Client before deploying:
  ```bash
  npx prisma generate
  ```
- Apply migrations in the production environment:
  ```bash
  npx prisma migrate deploy
  ```

### 10. Troubleshooting
- Check the PostgreSQL connection string if errors occur.
- Use `npx prisma migrate resolve` to resolve migration issues.
- Enable logging for Prisma Client:
  ```javascript
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });
  ```

---

