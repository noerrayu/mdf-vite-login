# Microfrontend Architecture with Vite, Module Federation & Shared Auth 👩‍💻

This project demonstrates a **microfrontend setup** using:

* **Vite**
* **React**
* **OriginJS Vite Plugin Federation**
* **Shared authentication via cookies (session)**
* **Remote components loaded dynamically**

There are **two apps**:

1. **Host App** – loads remote components
2. **Remote App** – provides exposed modules

---

# 1. Folder Structure

```
/host-app
/remote-app
/auth-service (optional external login API)
```

---

# 2. Environment Variables

Create a `.env` inside the project root:

```
VITE_AUTH_URL=auth.local.url:PORT/
VITE_REMOTE_APP_URL=remote.local.url.com:PORT/
VITE_HOST_APP_URL=host.local.url:PORT/
VITE_REMOTE=remote.local.url
VITE_HOST=host.local.url
```

---

# 3. Authentication Flow

* User opens Host App.
* Host App requests session from `auth-service`.
* If:

```
200 OK  → authenticated → show remote components
401     → show login form
```

Example of checking session:

```js
const res = await fetch("http://auth.url:3001/user", {
  credentials: "include",
});
```
Token will be stored inside cookies with same domain.

---

# 4. Run the Apps

### Remote App

```
npm install
npm run serve
```

### Host App

```
npm install
npm run serve
```

Make sure they run on different ports.

---
