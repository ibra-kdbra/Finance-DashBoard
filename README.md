# Modernized Finance Dashboard

A premium, modernized MERN stack finance dashboard featuring Clean Architecture, glassmorphic UI/UX, and comprehensive testing.

## Features

- **Clean Architecture**: Decoupled domain, data, and presentation layers for both client and server.
- **Glassmorphic Design**: Stunning translucent UI components using MUI 5 and custom styling.
- **Animations**: Fluid entrance and interactive animations powered by Framer Motion.
- **Modern Tech Stack**: React 18, Vite 4, RTK Query, Express 5, and Mongoose 8.
- **Testing Suite**: Robust unit testing with Vitest (Client) and Jest (Server).

## Prerequisites

- **Node.js**: v18 or higher recommended.
- **MongoDB**: A running instance (local or Atlas).

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd Finance-DashBoard
```

### 2. Server Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory with:

```env
PORT=1337
MONGO_URL=your_mongodb_connection_string
```

### 3. Client Setup

```bash
cd ../client
npm install
```

Create a `.env` file in the `client` directory with:

```env
VITE_BASE_URL=http://localhost:1337
```

## Running the Application

### Start the Server

```bash
cd server
npm run dev
```

### Start the Client

```bash
cd client
npm run dev
```

The application will be available at `http://localhost:5173`.

## Running Tests

### Server Tests

```bash
cd server
npm test
```

### Client Tests

```bash
cd client
npm run test
```
