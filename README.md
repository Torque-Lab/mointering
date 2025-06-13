# Mointering - Modern Website Monitoring Platform

A robust website monitoring platform built with modern technologies.This project helps you monitor your websites' uptime, performance, and health in real-time.

## 🏗️ Architecture

The project is built as a monorepo using Turborepo, consisting of multiple services:

- **Frontend**: Next.js application for the user interface
- **API**: Express.js backend service
- **Worker**: Separate service for polling user sites
- **Queue**: RabbitMQ for task management
- **Database**: PostgreSQL with TimescaleDB extension
- **ORM**: Prisma for database operations

## 🚀 Features

- Real-time website monitoring
- Efficient database writes using batching
- Distributed task processing
- Scalable architecture
- Modern and responsive UI

## 🛠️ Tech Stack

- **Monorepo Management**: Turborepo
- **Frontend**: Next.js
- **Backend**: Express.js
- **Message Queue**: RabbitMQ
- **Database**: PostgreSQL + TimescaleDB
- **ORM**: Prisma
- **Task Processing**: Custom worker service

## 📦 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- RabbitMQ
- Docker (optional, for containerized setup)

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/Torque-Lab/mointering.git
cd mointering
```

2. Install dependencies:
```bash
pnpm install
```


4. Start the development environment:
```bash
pnpm dev
```

## 🏗️ Project Structure

```
mointering/
├── apps/
│   ├── web as frontend/     # Next.js frontend application
│   ├── http-backend/         # Express.js backend service
│   └── worker-node/          # Polling worker service
├── packages/
│   ├── db/               # database configuration and schema
│   └──backend-common/      # common backend logic 
└── package.json
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the  respective service root directory 

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mointering"

# RabbitMQ
RABBITMQ_URL="amqp://localhost:5672"

# API
API_PORT=3001
API_HOST=localhost

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001
```
`



Project Link: [https://github.com/Torque-Lab/mointering]
