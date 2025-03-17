# InSync Backend

Welcome to the **InSync Backend** repository! This guide will help you set up and run the backend environment for the
project.

## 📌 Prerequisites

Ensure you have the following installed before proceeding:

- [Python](https://www.python.org/downloads/) (latest stable version)
- [pip](https://pip.pypa.io/en/stable/) (comes with Python)
- [Virtual Environment](https://docs.python.org/3/library/venv.html)
- [Git](https://git-scm.com/)

## 🚀 Setup Instructions

### 1️⃣ Enter Backend Directory

```sh
cd backend
```

### 2️⃣ Create a Virtual Environment

```sh
python -m venv .venv
```

### 3️⃣ Activate the Virtual Environment

#### Windows (PowerShell)

```sh
.venv\Scripts\Activate.ps1
```

#### macOS/Linux

```sh
source .venv/bin/activate
```

### 4️⃣ Install Dependencies

```sh
pip install -r requirements.txt
```

### 5️⃣ Running FastAPI

```sh
cd src
```

#### Development Mode

```sh
fastapi dev main.py
```

#### Production Mode

```sh
fastapi run
```