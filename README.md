# Mointering - Modern Website Monitoring Platform

A robust website monitoring platform built with modern technologies.This project helps you monitor your websites' uptime, performance, and health in real-time.

## 🏗️ Architecture

The project is built as a monorepo using Turborepo, consisting of multiple services:

### 🌐 Architecture Overview

#### Core Concept
- **Unified Domain Architecture**: Frontend and backend operate under the same domain (e.g., `https://sitewatch.suvidhaportal.com` for frontend and `https://suvidhaportal.com/api` for backend)
- **Zero CORS**: Seamless communication between frontend and backend without CORS complications, and still both are both are separate,that is nextjs is only for frontendand express node as primary backend and due to this we can enable as much strict security policies as possible related to auth
- **Custom Authentication**: Built-in authentication system replacing NextAuth with enhanced security features

#### How It Works
1. **In Development Mode**:
   - Next.js proxies API requests to Express backend using `next.config.mjs`
   - All requests hit the same Next.js public URL
   - Proxied to Express backend running separately

2. **In Production Mode**:
   - Kubernetes Ingress/Load Balancer routes `/api` of  requests of frontend url to Express backend
   - and by this we are  at same origin for all requests and we strict all security policies
#### Authentication Flow
- **Cookie-based Authentication** with strict security policies:
  - Secure, HttpOnly cookies for access and refresh tokens
  - CSRF protection with dedicated tokens
  - added Session management feature for both client and server components , you will find in /apps/frontend/app/providers

#### Why This Architecture?
- **Best of Both Worlds**: Combines Next.js frontend capabilities with Express backend flexibility
- **Simplified Authentication**: No need for NextAuth
- **Production-Grade Security**: Implements industry-standard security practices
- **Developer Experience**: Clean separation of concerns between frontend and backend

### 🏗️ System Components

| Component        | Technology            | Purpose                                  |
|----------------- |------------------     |------------------------------------------|
| **Frontend**     | Next.js               | User interface only                      |
| **Backend**      | Express.js            | Business logic and API endpoints         |
| **Message Queue**| RabbitMQ              | Task distribution and management         |
| **Worker**       | Node.js               | Background job processing and monitoring |
| **Central Cache**| Redis                 | Central cache store for auth  and rate limiting       |
| **Database**     | PostgreSQL+TimescaleDB|Primary data storage                      |
| **ORM**          | Prisma                | Type-safe database operations            |
| **Extensions**   | TimescaleDB           | Time-series data optimization            |

## 🚀 Features

- Real-time website monitoring
- Efficient database writes using batching
- Distributed task processing
- Scalable architecture
- Modern and responsive UI (UI may be not great but backend and DevOps are built with complete security and scalablibility in mind)
- Backend common and db directly bound to server like a external npm library in the form of packages in node_modules

## 🚀 Deployment
### CI/CD Pipeline
- **GitHub Actions**: Automated build and test workflows
- **Docker**: Containerization of all services 
-**fact** : You wil find that in dockerfile , even in final image i have done pnpm bridge:symlink command, you will be wondering why i did this ?  but wait workspace like pnpm,  work by doing symlink ((wait if you don't know symlink,it  is way to connect file or folder,its like pointer to point to another file if needed by some other without making copy in both place)) for node_modules, that is it  keep only one node_modules at root level and link it other apps who might need it(this is done by pnpm and pnpm  figure out it by  package.json of consumer app or service and link it only that libraries they claim), so when you even build this link in builder stage of docker and copy it to final image, this link will get broken due to layering of docker image and final code will throw module not found error,and i not saying this in just guess , i done 100 of various attempt to prevent symlink form breakage but despite due to filsystem and docker constraint it not work

- **Helm Charts**: Kubernetes package management
- **ArgoCD**: GitOps continuous delivery
- **Kubernetes**: Container orchestration

### Deployment Flow
1. Code push triggers GitHub Actions
2. Docker images are built and pushed to container registry and update tag in gitops repo which being mointering by argocd
3. ArgoCD detects changes and deploys to k8s clustar  environment
4. Helm is used to write templated and clean k8s resources
5. Health checks and automated rollback on failure

## 🛠️ Tech Stack

- **Monorepo Management**: Turborepo
- **Frontend**: Next.js
- **Backend**: Express.js
- **Message Queue**: RabbitMQ
- **Database**: PostgreSQL + TimescaleDB
- **ORM**: Prisma
- **Task Processing**: Custom worker service
## Note 
- Backend common and db prisma client directly bound to consumer app like extenral library in node_module
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
│   ├──  frontend/     # Next.js frontend application
│   ├──  http-backend/         # Express.js backend service
│   └──  worker-node/          # Polling worker service
├── packages/
│   ├── db/               # database configuration and schema
│   └──backend-common/      # common backend logic 
└── package.json  # root package.json
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

```
`
Project Link: [https://github.com/Torque-Lab/mointering]

