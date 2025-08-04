# TaskPing Backend

A modern REST API for task reminders built with **Hono** and **Bun**.

## 🚀 Tech Stack

- **Framework**: [Hono](https://hono.dev) - Fast, lightweight web framework
- **Runtime**: [Bun](https://bun.sh) - Fast JavaScript runtime
- **Database**: PostgreSQL with [Drizzle ORM](https://orm.drizzle.team)
- **Hosting**: Railway / Vercel
- **Authentication**: bcrypt for password hashing

## 📁 Project Structure

```
taskping/
├── src/
│   ├── db/
│   │   ├── index.ts       # Database connection
│   │   └── schema.ts      # Database schema
│   ├── routes/
│   │   ├── index.ts       # Route registration
│   │   ├── users.ts       # User endpoints
│   │   └── reminders.ts   # Reminder endpoints
│   └── index.ts           # Main server file
├── drizzle/              # Database migrations
├── package.json
└── README.md
```

## 🔧 Setup

1. **Install dependencies**
   ```bash
   bun install
   ```

2. **Setup environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database URL
   ```

3. **Run database migrations**
   ```bash
   bun db:generate
   bun db:migrate
   ```

4. **Start development server**
   ```bash
   bun dev
   ```

## 🌐 API Endpoints

### Users
- `GET /users` - List all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Reminders
- `GET /reminders` - List all reminders
- `GET /reminders/:id` - Get reminder by ID
- `GET /reminders/user/:userId` - Get user's reminders
- `POST /reminders` - Create new reminder
- `PUT /reminders/:id` - Update reminder
- `DELETE /reminders/:id` - Delete reminder

## 🚀 Deployment

### Railway
1. Connect your GitHub repository to Railway
2. Add `DATABASE_URL` environment variable
3. Deploy automatically!

## 📝 Environment Variables

```bash
DATABASE_URL=postgresql://user:password@host:port/database
PORT=3009
NODE_ENV=development
```

## 🛠️ Scripts

- `bun dev` - Start development server
- `bun start` - Start production server
- `bun db:generate` - Generate database migrations
- `bun db:migrate` - Apply database migrations

---

Built with ❤️ using Hono and Bun
