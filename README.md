# Backend-user
Backend user

# Requirements
- Docker
- Docker Compose
- NodeJS

# Environment file
1. Create a `.env` file in the root directory.
2. Add the following values to the file:

```
DATABASE_USER = 'mapTool'
DATABASE_PASSWORD = '1234'
DATABASE_IP = 'localhost'
DATABASE_PORT = '5432'
DATABASE_NAME = 'postgres'
DATABASE_URL = "postgresql://postgres:password@localhost:5432/wayfinder"
JWT_SECRET = "idkbruh"
```

# Setup
1. `npm i`
2. `npm run docker:up`
3. `npm run prisma:generate`
4. `npm run prisma:migrate`
5. `npm run dev`
