
# Frontend Docker Setup — README

This project is a **React (Vite) frontend** running inside Docker.

---

## Requirements

Make sure you have:

* **Docker**
* **Docker Compose**

Check:

```bash
docker --version
docker compose version
```

---

## Project Structure (short overview)

```
project/
│── Dockerfile
│── docker-compose.yml
│── package.json
└── src/...
```

The development server runs via Vite on port **5173**.

---

## How to Run the Project

### 1. Clone the repository

```bash
git clone https://github.com/sigaldev/strt-mini-app.git
cd strt-mini-app
```

### 2. Build the containers

```bash
docker compose build
```

### 3. Start the project

```bash
docker compose up
```

After the container starts, the frontend will be available at:

[http://localhost:5173](http://localhost:5173)

---

## ✅ Stop the project

```bash
docker compose down
```

---

## ✅ Rebuild when dependencies change

If `package.json` or `Dockerfile` was updated:

```bash
docker compose up --build
```
