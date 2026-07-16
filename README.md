# 🚀 PromptSphere - AI Prompt Sharing & Marketplace

PromptSphere is a modern SaaS marketplace where users can discover, create, share, and monetize high-quality AI prompts for popular Large Language Models (LLMs) and image generation tools such as ChatGPT, Claude, Gemini, Midjourney, DALL·E, and Stable Diffusion.

The platform provides a complete ecosystem for prompt engineers, developers, and designers with role-based access, premium subscriptions, analytics, and moderation tools.

---

# 🌐 Live Demo

* **Live Website:** https://ai-prompt-client-rose.vercel.app/

* **Server Repository:** https://github.com/Syedadnanalamin/AI_Prompt_Server

---

# 📸 Project Screenshot

> Replace the image below with your latest homepage/dashboard screenshot.

```text
README/assets/promptsphere-preview.png
```

![PromptSphere Screenshot](README/assets/promptsphere-preview.png)

---

# 📝 Project Overview

PromptSphere helps AI enthusiasts discover and organize effective prompts while giving creators the ability to publish premium prompt collections and track their performance. The platform combines authentication, subscriptions, moderation, analytics, and a responsive marketplace into one modern application.

---

# 🛠️ Technologies Used

## Frontend

* Next.js 16 (App Router)
* React 19
* Tailwind CSS
* Better Auth
* MongoDB
* Framer Motion
* Recharts
* Lucide React
* Radix UI
* React Hot Toast

## Backend

* Express.js
* MongoDB
* Stripe
* Better Auth
* CORS
* Dotenv

---

# ✨ Core Features

### 🔐 Authentication & Authorization

* Secure authentication using Better Auth
* Email/password login
* Social authentication
* Role-Based Access Control (User, Creator, Admin)
* Protected routes

### 🛒 AI Prompt Marketplace

* Browse prompts with beautiful cards
* Live keyword search
* Category filtering
* Tool filtering
* Difficulty filtering
* Server-side pagination
* Popular, Latest, and Most Copied sorting

### 👨‍💻 Creator Dashboard

* Publish prompts
* Edit/Delete prompts
* Track bookmarks
* Monitor copy counts
* Analytics dashboard using Recharts

### ⭐ Community Features

* Bookmark prompts
* Copy prompts instantly
* Rate prompts
* Leave reviews
* Report inappropriate content

### 💳 Premium Subscription

* Stripe payment integration
* Lifetime Premium plan
* Secure checkout flow

### 🧪 AI Sandbox

* Test prompts before using them
* Dynamic variable input
* Simulated AI response streaming

### 🛡️ Admin Dashboard

* Review submitted prompts
* Approve or reject prompts
* Manage users and roles
* Handle reported content
* Monitor platform activity

---

# 📦 Main Dependencies

## Client

* next
* react
* react-dom
* better-auth
* @better-auth/mongo-adapter
* mongodb
* framer-motion
* recharts
* lucide-react
* react-hot-toast
* @radix-ui/react-dialog
* @radix-ui/react-tabs
* @radix-ui/react-select
* @radix-ui/react-dropdown-menu

## Server

* express
* mongodb
* stripe
* cors
* dotenv
* nodemon

---

# ⚙️ Environment Variables

## Server (.env)

```env
PORT=8080

MONGO_URI=your_mongodb_connection_string

BETTER_AUTH_SECRET=your_secret

BETTER_AUTH_URL=http://localhost:3000

STRIPE_SECRET_KEY=your_stripe_secret_key
```

## Client (.env.local)

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_publishable_key
```

---

# 🚀 Run Locally

### 1. Clone the repositories

```bash
git clone https://github.com/yourusername/AI_Prompt_Client.git

git clone https://github.com/yourusername/AI_Prompt_Server.git
```

---

### 2. Install dependencies

#### Client

```bash
cd AI_Prompt_Client
npm install
```

#### Server

```bash
cd AI_Prompt_Server
npm install
```

---

### 3. Configure Environment Variables

Create:

* `.env.local` inside **AI_Prompt_Client**
* `.env` inside **AI_Prompt_Server**

Copy the variables shown above.

---

### 4. Start the backend

```bash
cd AI_Prompt_Server
npm start
```

---

### 5. Start the frontend

```bash
cd AI_Prompt_Client
npm run dev
```

---

### 6. Open the application

Visit:

```
http://localhost:3000
```

---

# 📂 Repository Structure

```
AI_Prompt_Client/
AI_Prompt_Server/
```

---

# 📌 Resources

* Live Website
* Client Repository
* Server Repository
* MongoDB Atlas
* Stripe Dashboard

---

# 👨‍💻 Author

**Syed Adnan**

Full Stack Developer (MERN)
