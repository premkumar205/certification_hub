# CertifyHub Integration & Deployment Guide

Welcome to the new backend for CertifyHub! This guide will show you how to connect your HTML/CSS/JS frontend to the new FastAPI backend, replacing `localStorage` with real API calls using `fetch`. It also covers deploying the backend to Render.

---

## 1. Local Development Setup

To run the backend locally, open a terminal in the `backend` folder and run:

```bash
# Optional: Create a virtual environment
python -m venv venv
venv\\Scripts\\activate  # On Windows

# Install dependencies
pip install -r requirements.txt

# Run the backend
uvicorn main:app --reload
```

Your API will be running at `http://127.0.0.1:8000`.
You can view the interactive documentation (Swagger UI) at `http://127.0.0.1:8000/docs`.

---

## 2. Replacing `localStorage` with `fetch` (Frontend Integration)

Currently, your frontend likely does something like `localStorage.setItem('users', ...)` or `localStorage.getItem('certificates')`. We will replace these with HTTP requests.

### Configuration
At the top of your `script.js` or in a new `api.js` file, define your backend URL:
```javascript
// Change this to your Render URL after deployment
const API_BASE_URL = "http://127.0.0.1:8000"; 
```

### A. Register User
```javascript
async function registerUser(username, email, phone, password, role = "user") {
    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, phone, password, role })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail);
        }
        
        const user = await response.json();
        console.log("Registered successfully:", user);
        return user;
    } catch (error) {
        alert("Registration failed: " + error.message);
    }
}
```

### B. Login User
```javascript
async function loginUser(username, password) {
    try {
        // FastAPI OAuth2 implementation uses form data, not JSON
        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);
        
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) throw new Error("Incorrect credentials");
        
        const data = await response.json();
        const token = data.access_token;
        
        // Store the token in localStorage so we can use it for protected routes
        localStorage.setItem("token", token);
        console.log("Logged in!");
        return token;
    } catch (error) {
        alert("Login failed: " + error.message);
    }
}
```

### C. Add Certificate
To access protected routes, pass the saved JWT token in the `Authorization` header.

```javascript
async function addCertificate(name, issuer, date, link, photo) {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please log in first.");

    try {
        const response = await fetch(`${API_BASE_URL}/certificates/`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ name, issuer, date, link, photo })
        });
        
        if (!response.ok) throw new Error("Failed to add certificate");
        
        const cert = await response.json();
        console.log("Certificate added:", cert);
        return cert;
    } catch (error) {
        console.error(error);
    }
}
```

### D. Get My Certificates (User Dashboard)
```javascript
async function getMyCertificates() {
    const token = localStorage.getItem("token");
    if (!token) return [];

    try {
        const response = await fetch(`${API_BASE_URL}/certificates/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error("Failed to fetch certificates");
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}
```

### E. Admin Dashboard: Get All Users and Their Certificates
```javascript
async function getAdminData() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
        // Get all users (this route also returns their certificates)
        const response = await fetch(`${API_BASE_URL}/users`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.status === 403) {
            alert("Admin privileges required.");
            return;
        }
        
        const users = await response.json();
        console.log("All platform data:", users);
        // `users` is an array of objects. 
        // Each user looks like: { id, username, email, phone, role, certificates: [...] }
        
        renderAdminDashboard(users);
    } catch (error) {
        console.error(error);
    }
}

function renderAdminDashboard(users) {
    const container = document.getElementById("admin-container");
    container.innerHTML = "";
    
    users.forEach(user => {
        let userHTML = `<h3>User: ${user.username} (Role: ${user.role})</h3>`;
        userHTML += `<ul>`;
        user.certificates.forEach(cert => {
            userHTML += `<li>${cert.name} by ${cert.issuer}</li>`;
        });
        userHTML += `</ul>`;
        container.innerHTML += userHTML;
    });
}
```

---

## 3. Deployment Guide

### Deploying Backend to Render

1. Create a GitHub repository and push your `backend` code (including `requirements.txt`).
   *Tip: Ensure you have a `.gitignore` file that ignores the `venv/` folder and `__pycache__/`.*
2. Go to [Render](https://render.com/), sign in, and click **New > Web Service**.
3. Connect your GitHub repository.
4. Render Configuration:
   - **Name**: `certifyhub-backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Click **Deploy Web Service**.
6. Wait 2-3 minutes. Once live, Render will give you a URL like `https://certifyhub-backend.onrender.com`.

### Connecting Frontend on GitHub Pages

1. Open your frontend source code (`script.js` or `api.js`).
2. Update the `API_BASE_URL`:
   ```javascript
   // Change this to your Render URL! No trailing slash.
   const API_BASE_URL = "https://certifyhub-backend.onrender.com"; 
   ```
3. Commit and push your frontend changes to GitHub to trigger a GitHub Pages rebuild.
4. Your live GitHub Pages site will now communicate with the live Render backend!
