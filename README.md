# Auralens Studio Website

A full-stack photography studio web application for **Auralens Studio**, offering services such as newborn, maternity, milestone, and classes photoshoots. The project consists of a **Next.js** frontend and a **Spring Boot** backend, with **MongoDB** as the database, **Cloudinary** for image storage, and **Razorpay** for payment processing.

---

## Table of Contents

- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [API Reference](#api-reference)
- [Authentication & Roles](#authentication--roles)
- [Admin Dashboard](#admin-dashboard)
- [Client Dashboard](#client-dashboard)
- [Payment Flow](#payment-flow)
- [Image Management](#image-management)
- [Deployment Notes](#deployment-notes)

---

## Project Structure

```
studio_website_main/
├── backend/                         # Spring Boot application
│   ├── src/
│   │   └── main/
│   │       ├── java/com/auralens/studio/
│   │       │   ├── config/          # Cloudinary, Security configuration
│   │       │   ├── controllers/     # REST API controllers
│   │       │   ├── models/          # MongoDB document models
│   │       │   ├── repositories/    # Spring Data MongoDB repositories
│   │       │   ├── security/        # JWT filter & token provider
│   │       │   └── services/        # Business logic layer
│   │       └── resources/
│   │           └── application.properties
│   └── build.gradle
│
└── frontend/                        # Next.js application
    └── src/
        ├── app/                     # Next.js App Router pages
        │   ├── page.tsx             # Home page
        │   ├── booking/             # Booking page
        │   ├── contact/             # Contact page
        │   ├── gallery/             # Gallery page
        │   ├── login/               # Login page
        │   ├── reviews/new/         # Submit a review
        │   ├── services/            # Service pages (newborn, maternity, milestone, classes)
        │   ├── client-dashboard/    # Client portal
        │   └── admin/               # Admin dashboard
        ├── components/              # Reusable UI components
        ├── pages/                   # Legacy/additional page components
        ├── styles/                  # CSS stylesheets
        ├── hooks/                   # Custom React hooks
        ├── data/                    # Static data files
        └── types/                   # TypeScript type definitions
```

---

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Java 17+ | Primary language |
| Spring Boot 3.x | Application framework |
| Spring Security | JWT-based stateless authentication |
| Spring Data MongoDB | Database ORM layer |
| MongoDB | NoSQL database |
| Cloudinary | Image upload and storage |
| Razorpay | Payment gateway integration |
| Gradle | Build tool |

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 14+ (App Router) | React framework with SSR |
| TypeScript | Type safety |
| CSS Modules / Global CSS | Styling |

---

## Features

### Public-Facing
- **Home Page** — Hero section, About, Services overview, Why Choose Us, Gallery preview, Reviews
- **Service Pages** — Detailed pages for Newborn, Maternity, Milestone, and Classes photoshoots with dynamic pricing
- **Gallery** — Browsable photo gallery managed by the admin
- **Booking** — Booking form with Razorpay payment integration
- **Contact** — Contact form submissions stored in the database
- **Reviews** — Customers can submit reviews; approved reviews are shown on the homepage
- **Login** — Unified login for admins and clients

### Admin Dashboard
- **Bookings** — View, manage, and delete all bookings
- **Payments** — Track payment statuses (pending, paid, failed)
- **Gallery** — Upload, update, and delete gallery images (via Cloudinary)
- **Wheel Images** — Manage rotating display images on the homepage
- **Service Package Pricing** — Update prices for each service package
- **Reviews** — Moderate and approve/reject customer reviews
- **Messages** — View contact form submissions
- **Client Users** — Create, activate/deactivate, and delete client accounts
- **Client Images** — Upload edited photos to a client's booking
- **Settings** — Manage site-wide settings
- **User Management** — Manage admin user accounts

### Client Dashboard
- View booking details and payment receipt
- View delivered edited photos
- Request re-edits on specific photos
- Download photos to device or Google Drive
- In-app chat with the studio admin

---

## Prerequisites

- **Java 17+**
- **Gradle 8+** (or use the included Gradle wrapper)
- **Node.js 18+** and **npm / yarn**
- **MongoDB** (local instance or MongoDB Atlas)
- **Cloudinary** account
- **Razorpay** account

---

## Environment Variables

### Backend (`application.properties` / Environment)

| Variable | Description | Default |
|---|---|---|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/auralens` |
| `JWT_SECRET` | Secret key for signing JWT tokens | *(hardcoded fallback — override in production)* |
| `ADMIN_USERNAME` | Default admin username | `admin` |
| `ADMIN_PASSWORD` | Default admin password | `adminpassword` |
| `RAZORPAY_KEY_ID` | Razorpay public key ID | `rzp_test_placeholder` |
| `RAZORPAY_KEY_SECRET` | Razorpay secret key | `rzp_test_secret_placeholder` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | *(empty — required)* |
| `CLOUDINARY_API_KEY` | Cloudinary API key | *(empty — required)* |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | *(empty — required)* |

> ⚠️ **Security Notice:** Always override `JWT_SECRET`, `ADMIN_PASSWORD`, and all Razorpay/Cloudinary credentials via environment variables in production. Never commit secrets to version control.

### Frontend

Create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd studio_website_main/backend
   ```

2. Set the required environment variables (or update `application.properties` for local development).

3. Build and run the application:
   ```bash
   # Using Gradle wrapper
   ./gradlew bootRun

   # Or build a JAR and run
   ./gradlew build
   java -jar build/libs/*.jar
   ```

4. The backend will start on `http://localhost:5000`.

5. Verify the server is running:
   ```bash
   curl http://localhost:5000/health
   ```

---

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd studio_website_main/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## API Reference

All API endpoints are prefixed with `/api`.

### Authentication — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Login (admin or client) |
| `POST` | `/api/auth/client/register` | Public | Register a client user |
| `GET` | `/api/auth/client/booking/:bookingId` | Public | Get client by booking ID |
| `GET` | `/api/auth/client/admin/users` | Admin | List all client users |
| `PUT` | `/api/auth/client/admin/:id/status` | Admin | Activate/deactivate a client |
| `DELETE` | `/api/auth/client/admin/:id` | Admin | Delete a client user |

### Bookings — `/api/bookings`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/bookings` | Public | Create a new booking |
| `POST` | `/api/bookings/razorpay/order` | Public | Initiate Razorpay payment order |
| `POST` | `/api/bookings/razorpay/verify` | Public | Verify payment signature & confirm booking |
| `GET` | `/api/bookings/admin` | Admin | Get all bookings |
| `DELETE` | `/api/bookings/admin/:id` | Admin | Delete a booking |
| `GET` | `/api/bookings/client/:id` | Client | Get a specific booking |
| `PUT` | `/api/bookings/admin/:id/images` | Admin | Upload edited images to a booking |
| `PUT` | `/api/bookings/client/:id/images` | Client | Update image re-edit requests |

### Gallery — `/api/gallery-images`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/gallery-images` | Public | List all gallery images |
| `POST` | `/api/gallery-images` | Admin | Upload a gallery image |
| `PUT` | `/api/gallery-images/:id` | Admin | Update a gallery image |
| `DELETE` | `/api/gallery-images/:id` | Admin | Delete a gallery image |

### Reviews — `/api/reviews`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/reviews` | Public | List all approved reviews |
| `POST` | `/api/reviews` | Public | Submit a new review |
| `GET` | `/api/reviews/admin` | Admin | List all reviews (including pending) |
| `PUT` | `/api/reviews/admin/:id` | Admin | Approve or reject a review |
| `DELETE` | `/api/reviews/admin/:id` | Admin | Delete a review |

### Contact — `/api/contact`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/contact` | Public | Submit a contact message |
| `GET` | `/api/contact/admin` | Admin | List all contact messages |
| `DELETE` | `/api/contact/admin/:id` | Admin | Delete a contact message |

### Service Package Pricing — `/api/service-package-prices`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/service-package-prices` | Public | Get all package prices |
| `PUT` | `/api/service-package-prices/:id` | Admin | Update a package price |

### Wheel Images — `/api/wheel-images`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/wheel-images` | Public | Get all wheel images |
| `POST` | `/api/wheel-images/upload` | Admin | Upload a new wheel image |
| `PUT` | `/api/wheel-images` | Admin | Update wheel images |

### Site Settings — `/api/settings`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/settings` | Public | Get site settings |
| `PUT` | `/api/settings` | Admin | Update site settings |

### Chat — `/api/chat`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/chat/history/:clientId` | Authenticated | Get chat history for a client |
| `POST` | `/api/chat/send` | Authenticated | Send a chat message |
| `GET` | `/api/chat/unread-counts` | Admin | Get unread message counts per client |
| `PUT` | `/api/chat/read/:clientId` | Admin | Mark messages as read (admin side) |
| `GET` | `/api/chat/unread-count/client/:clientId` | Client | Get unread count for a client |
| `PUT` | `/api/chat/read/client/:clientId` | Client | Mark messages as read (client side) |

### Health — `/health`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/health` | Public | Health check |

---

## Authentication & Roles

The application uses **JWT-based stateless authentication**.

- **Admin** — Full access to all `/admin` endpoints; credentials set via `ADMIN_USERNAME` / `ADMIN_PASSWORD` environment variables.
- **Client** — Access to their own booking data, image downloads, re-edit requests, and chat.
- **Public** — Access to browsing, booking creation, contact, reviews, and gallery.

JWTs are issued at login and must be included as a `Bearer` token in the `Authorization` header for protected routes.

---

## Admin Dashboard

Access the admin panel at `/admin`. Log in using the admin credentials configured in the environment variables.

The dashboard includes sections for:

- **Bookings** — Full booking list with client details, payment status, and delete action
- **Payments** — Overview of paid, pending, and failed payment records
- **Client Images** — Upload and manage delivered photos per booking
- **Client Users** — Manage portal accounts linked to bookings
- **Gallery** — Add or remove public gallery photos
- **Wheel** — Manage the rotating image showcase on the homepage
- **Pricing** — Set or update service package prices
- **Reviews** — Approve or moderate submitted reviews
- **Messages** — Inbox for contact form submissions
- **Settings** — Site-wide configuration
- **User Management** — Manage admin sub-accounts

---

## Client Dashboard

After a booking is created and a client account is set up by the admin, clients can log in at `/login` to:

- View their booking summary and payment receipt
- Browse the edited photos delivered by the studio
- Request re-edits on specific photos
- Download photos directly to their device or to Google Drive
- Chat directly with the studio

---

## Payment Flow

Bookings use **Razorpay** for payment processing:

1. Client fills in the booking form and submits.
2. The frontend calls `POST /api/bookings/razorpay/order` to create a Razorpay order.
3. The Razorpay payment modal opens in the client's browser.
4. On payment completion, the frontend calls `POST /api/bookings/razorpay/verify` with the payment ID, order ID, and signature.
5. The backend verifies the HMAC signature against `RAZORPAY_KEY_SECRET`.
6. On success, the booking is marked as `paid` and the payment method is recorded. On failure, it is marked as `failed`.

---

## Image Management

All images (gallery, wheel, and client delivery photos) are stored on **Cloudinary**.

- The backend uses the Cloudinary Java SDK configured via `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`.
- File uploads are limited to **10 MB** per file and **10 MB** per request (configurable in `application.properties`).
- Cloudinary URLs are stored in MongoDB and served directly to the frontend.

---

## Deployment Notes

- **CORS** is currently configured to allow only `http://localhost:3000`. Update `SecurityConfig.java` to include your production frontend domain before deploying.
- **JWT Secret** — Replace the default secret with a strong, randomly generated value in production.
- **Admin credentials** — Change the default `admin` / `adminpassword` via environment variables.
- **MongoDB** — Use a managed service (e.g., MongoDB Atlas) in production and set `MONGO_URI` accordingly.
- **Razorpay** — Switch from test keys (`rzp_test_*`) to live keys for production.
- The frontend build output lives in `frontend/.next/`. Run `npm run build` and serve with `npm start` or deploy to Vercel.
- The backend can be packaged as a JAR (`./gradlew build`) and deployed to any Java-compatible hosting environment (e.g., Railway, Render, AWS EC2).
