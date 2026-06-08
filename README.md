# 🚀 Event-Driven Microservices E-Commerce Platform (Turborepo)

A premium, production-grade, asynchronous e-commerce platform built as a monorepo utilizing a microservices architecture. The system leverages **Next.js** for frontend applications, diverse Node.js frameworks (**Express**, **Fastify**, **Hono**) for backend microservices, **Apache Kafka** for event-driven messaging, and **PostgreSQL** & **MongoDB** for persistent storage.

---

## 📐 System Architecture

This platform utilizes an event-driven choreography pattern to ensure high cohesion, low coupling, and asynchronous processing between services.

```mermaid
graph TD
  subgraph Frontend Apps
    Client["Client App (Next.js) <br> Port 3002"]
    Admin["Admin Panel (Next.js) <br> Port 3003"]
  end

  subgraph Messaging Broker
    Kafka["Apache Kafka Cluster <br> Ports 9094 - 9096"]
  end

  subgraph Microservices
    Auth["Auth Service (Express) <br> Port 8003"]
    Product["Product Service (Express) <br> Port 8000"]
    Order["Order Service (Fastify) <br> Port 8001"]
    Payment["Payment Service (Hono) <br> Port 8002"]
    Email["Email Service (Consumer)"]
  end

  subgraph Databases & External
    Postgres[("PostgreSQL (Product DB)")]
    Mongo[("MongoDB (Order DB)")]
    Clerk["Clerk Auth"]
    Stripe["Stripe Payments"]
    Cloudinary["Cloudinary CDN"]
    Gmail["Gmail SMTP"]
  end

  %% Client/Admin Flow
  Client -.-> Clerk
  Admin -.-> Clerk
  Admin -.-> Cloudinary
  Client -.-> Payment
  Admin -.-> Product
  Admin -.-> Auth
  Client -.-> Product
  Client -.-> Order

  %% Auth Service
  Auth --> Clerk
  Auth -- "Publishes: user.created" --> Kafka
  
  %% Product Service
  Product --> Postgres
  Product -- "Publishes: product.created / product.deleted" --> Kafka
  
  %% Payment Service
  Payment --> Stripe
  Payment -- "Publishes: payment.successful" --> Kafka
  Kafka -- "Subscribes: product.*" --> Payment

  %% Order Service
  Order --> Mongo
  Kafka -- "Subscribes: payment.successful" --> Order
  Order -- "Publishes: order.created" --> Kafka

  %% Email Service
  Kafka -- "Subscribes: user.created / order.created" --> Email
  Email --> Gmail
```

### 🔄 Choreography Event Flows
1. **User Sign Up / Sync**: When a user is registered or updated, the **Auth Service** handles synchronization and publishes a `user.created` event to Kafka. The **Email Service** consumes this event and dispatches a welcome email.
2. **Product Catalog Sync**: When an Administrator creates a new product in the **Admin Panel**, the **Product Service** persists it in the PostgreSQL database and emits a `product.created` event. The **Payment Service** listens to this event to automatically create a corresponding product and price catalog entry inside **Stripe**.
3. **Asynchronous Order Processing**:
   - The user selects products in the **Client App** and initiates Stripe checkout.
   - The **Payment Service** creates a Stripe checkout session.
   - Upon successful payment, Stripe sends a webhook to the **Payment Service**, which verifies the signature and publishes a `payment.successful` event to Kafka.
   - The **Order Service** consumes the `payment.successful` event, stores the order under MongoDB, and publishes an `order.created` event.
   - The **Email Service** receives `order.created` and sends a transaction confirmation mail to the customer.

---

## 🛠️ Technology Stack

| Component | Framework / Technology | Purpose |
| :--- | :--- | :--- |
| **Monorepo Manager** | [Turborepo](https://turbo.build/) | Package orchestration, dependency mapping, & build pipeline caching |
| **Package Manager** | [pnpm](https://pnpm.io/) | Fast, disk-space efficient workspace dependency resolution |
| **Client Frontend** | Next.js 15, Tailwind CSS v4, Zustand | Customer shopping experience, cart state management |
| **Admin Frontend** | Next.js 15, Tailwind CSS v4, TanStack Query, Radix UI | Dashboard portal for listing orders, managing categories & catalog |
| **Auth Service** | Express, `@clerk/express` | User administration & Clerk gateway |
| **Product Service** | Express, Prisma ORM | Product & category catalog gateway |
| **Order Service** | Fastify, `@clerk/fastify` | High-performance Order intake & retrieval API |
| **Payment Service** | Hono, `@hono/node-server`, Stripe SDK | Stripe checkout gateway and webhooks handler |
| **Email Service** | Node.js, Nodemailer | Background event handler for notifications |
| **Message Broker** | Apache Kafka (`kafkajs`) | Decoupled asynchronous event broker |
| **Databases** | PostgreSQL & MongoDB | Microservice-isolated datastores |

---

## 📁 Workspace Directory Structure

```text
notxrasa/
├── apps/
│   ├── client/              # Next.js customer application (Port 3002)
│   ├── admin/               # Next.js admin dashboard (Port 3003)
│   ├── auth-service/        # Express app managing auth & user directory (Port 8003)
│   ├── product-service/     # Express app managing product catalog (Port 8000)
│   ├── order-service/       # Fastify app managing transactions (Port 8001)
│   ├── payment-service/     # Hono app managing Stripe integration (Port 8002)
│   └── email-service/       # Node.js background worker consumer sending emails
├── packages/
│   ├── kafka/               # Shared Kafkajs wrappers and local docker-compose configuration
│   ├── product-db/          # Shared Prisma schema, clients, and migrations for PostgreSQL
│   ├── order-db/            # Shared Mongoose configuration and schemas for MongoDB
│   ├── types/               # Shared TypeScript type definitions
│   ├── typescript-config/   # Shared tsconfig blueprints
│   └── eslint-config/       # Shared ESLint parameters
├── turbo.json               # Turborepo task pipeline configuration
├── package.json             # Root monorepo script registry
└── pnpm-workspace.yaml      # Monorepo workspaces definition
```

---

## 🔌 Port Registry

| Service | Port | Base URL |
| :--- | :--- | :--- |
| **Product Service** | `8000` | `http://localhost:8000` |
| **Order Service** | `8001` | `http://localhost:8001` |
| **Payment Service** | `8002` | `http://localhost:8002` |
| **Auth Service** | `8003` | `http://localhost:8003` |
| **Client Application** | `3002` | `http://localhost:3002` |
| **Admin Panel** | `3003` | `http://localhost:3003` |
| **Kafka Broker 1** | `9094` | `localhost:9094` |
| **Kafka Broker 2** | `9095` | `localhost:9095` |
| **Kafka Broker 3** | `9096` | `localhost:9096` |
| **Kafka UI Dashboard** | `8080` | `http://localhost:8080` |

---

## 🚀 Local Host Setup & Installation

Follow these steps to set up the entire monorepo on your local machine:

### 📋 Prerequisites
- **Node.js** (v18 or higher recommended)
- **pnpm** (v9 or higher recommended)
- **Docker** and **Docker Compose** (to run the Kafka cluster)
- **PostgreSQL** instance running locally or hosted on the cloud
- **MongoDB** instance running locally or hosted on the cloud

---

### Step 1: Install Dependencies
From the root directory of the project, execute:
```bash
pnpm install
```

---

### Step 2: Run Kafka Cluster
Start the 3-broker KRaft Kafka cluster and the Kafka-UI administration dashboard using Docker:
```bash
docker compose -f packages/kafka/docker-compose.yml up -d
```
Once healthy, verify broker status by visiting the Kafka UI at `http://localhost:8080`.

---

### Step 3: Configure Environment Variables
Copy the `.env.example` configurations into actual `.env` files in their respective folders:

1. **Product Database (`packages/product-db/.env`)**
   ```bash
   DATABASE_URL="postgresql://username:password@localhost:5432/product_db?schema=public"
   ```
2. **Product Service (`apps/product-service/.env`)**
   ```bash
   PORT=8000
   DATABASE_URL="postgresql://username:password@localhost:5432/product_db?schema=public"
   CLERK_SECRET_KEY=your_clerk_secret_key
   CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   ```
3. **Order Service (`apps/order-service/.env`)**
   ```bash
   PORT=8001
   MONGO_URL="mongodb://localhost:27017/order_db"
   CLERK_SECRET_KEY=your_clerk_secret_key
   CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   ```
4. **Payment Service (`apps/payment-service/.env`)**
   ```bash
   PORT=8002
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   CLERK_SECRET_KEY=your_clerk_secret_key
   CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   ```
5. **Auth Service (`apps/auth-service/.env`)**
   ```bash
   PORT=8003
   CLERK_SECRET_KEY=your_clerk_secret_key
   CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   ```
6. **Email Service (`apps/email-service/.env`)**
   ```bash
   GOOGLE_CLIENT_ID=your_google_oauth2_client_id
   GOOGLE_CLIENT_SECRET=your_google_oauth2_client_secret
   GOOGLE_REFRESH_TOKEN=your_google_oauth2_refresh_token
   ```
7. **Client Application (`apps/client/.env.local`)**
   ```bash
   PORT=3002
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_PRODUCT_SERVICE_URL=http://localhost:8000
   NEXT_PUBLIC_ORDER_SERVICE_URL=http://localhost:8001
   NEXT_PUBLIC_PAYMENT_SERVICE_URL=http://localhost:8002
   NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:8003
   ```
8. **Admin Panel (`apps/admin/.env.local`)**
   ```bash
   PORT=3003
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_PRODUCT_SERVICE_URL=http://localhost:8000
   NEXT_PUBLIC_ORDER_SERVICE_URL=http://localhost:8001
   NEXT_PUBLIC_PAYMENT_SERVICE_URL=http://localhost:8002
   NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:8003
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   ```

---

### Step 4: Run Prisma Database Migrations
Generate the Prisma Client and migrate your PostgreSQL schema for the product database:
```bash
# Generate the local Prisma Client
pnpm db:generate

# Execute the database schema migrations
pnpm db:migrate
```

---

### Step 5: Start the Development Server
Launch all microservices and Next.js applications in watch mode:
```bash
pnpm dev
```
Turbo will automatically manage running all ports:
- **Product catalog API**: `http://localhost:8000`
- **Orders API**: `http://localhost:8001`
- **Payments checkout**: `http://localhost:8002`
- **Auth endpoint**: `http://localhost:8003`
- **Client App**: `http://localhost:3002`
- **Admin Panel**: `http://localhost:3003`

---

## 💻 Monorepo Scripts Reference

| Command | Action |
| :--- | :--- |
| `pnpm dev` | Runs all apps and services simultaneously in development/watch mode. |
| `pnpm build` | Compiles and builds all apps/packages in dependency order. |
| `pnpm lint` | Runs ESLint validations across all workspaces. |
| `pnpm format` | Formats the files using Prettier. |
| `pnpm check-types` | Type-checks all TypeScript code across the repository. |
| `pnpm db:generate` | Generates the Prisma Client. |
| `pnpm db:migrate` | Runs database migrations for development schema change. |
| `pnpm db:deploy` | Applies production schema migration. |
