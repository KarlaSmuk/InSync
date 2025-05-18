# InSync Frontend

Welcome to the **InSync Frontend**! This guide will help you set up and run the frontend.

## 📌 Prerequisites

Ensure you have the following installed before proceeding:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [pnpm](https://pnpm.io/) (`npm install -g pnpm`)
- [Git](https://git-scm.com/)

## 🚀 Setup Instructions

### 1️⃣ Enter Frontend Directory

```sh
cd frontend
```

### 2️⃣ Install Dependencies

```sh
pnpm install
```

### 3️⃣ Start the Development Server

```sh
cd src
```

```sh
pnpm run dev
```

### Generate API From OpenApi schema

```sh
pnpm orval
```

## 📦 Build for Production

To create an optimized production build, run:

```sh
pnpm run build
```

To preview the production build locally:

```sh
pnpm run preview
```
