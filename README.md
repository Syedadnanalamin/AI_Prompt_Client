# PromptSphere - AI Prompt Sharing & Marketplace Platform

PromptSphere is a modern, community-driven SaaS ecosystem designed to discover, create, bookmark, review, and monetize high-performance AI prompts for LLM and image models (such as ChatGPT, Claude, Midjourney, DALL-E, Gemini, and Stable Diffusion).

## Purpose
The platform connects prompt engineers (Creators) with developers and designers looking for optimized instructions, offering role-based controls, dashboard analytics, a payment interface for subscription upgrades, and robust admin moderation tools.

## Key Features
* **Role-Based Access Control (RBAC):** Supports `User`, `Creator`, and `Admin` permissions. Protected routes verify roles before granting access.
* **Authentication with Better Auth:** Secure email/password registrations, sign-ins, and social sign-on handlers.
* **Visual Marketplace & Search:** Live keyword search (by title, tool, tags), sidebar filters (category, tool, difficulty), sorting (popular, copied, latest), and server-side pagination.
* **Prompt Analytics:** Creators track engagement (copy counts and bookmarks) with visual charts rendered via Recharts.
* **Payment Gateway Integration:** Integrated Stripe elements checking out lifetime Premium passes for $5.
* **AI Sandbox Simulator:** Try prompts inside a mock console with customizable variable inputs and dynamic model output text streams.
* **Reviews and Flagging:** Write reviews with star-ratings, and report violations (spam, copyright, inappropriate content) directly to admins.
* **Moderation Workspace:** Admins approve/reject prompt submissions, update roles, manage logs, dismiss reports, and analyze global telemetry.

---

## npm Packages Used

### Next.js Client (`AI_Prompt_Client`)
* `next` (v16.2.9) - App Router React framework
* `react` / `react-dom` (v19.2.4) - Render engine
* `better-auth` / `@better-auth/mongo-adapter` - User session handlers & MongoDB mapping
* `mongodb` (v7.3.0) - Connection drivers
* `framer-motion` - Dynamic fade-in/slide-out animations
* `recharts` - Analytics timeline rendering
* `lucide-react` - UI icon set
* `react-hot-toast` - Action state confirmations
* `@radix-ui/react-dialog` / `@radix-ui/react-tabs` / `@radix-ui/react-select` / `@radix-ui/react-dropdown-menu` - UI components accessibility primitives

### Express Server (`AI_Prompt_Server`)
* `express` - Backend runtime framework
* `cors` - Safe CORS headers
* `dotenv` - Environmental value injector
* `mongodb` - Database connector
* `stripe` - Payment verification SDK
* `nodemon` - Hot-reload tool (Development)

---

## Getting Started

### Prerequisites
* Node.js v26.3.1 (or higher)
* Active MongoDB Atlas cluster URI
* Stripe Publishable and Secret Keys

### Configuration
Create `.env` inside `AI_Prompt_Server/` and `.env.local` inside `AI_Prompt_Client/` with:
```env
PORT=8080
MONGO_URI="mongodb://your-mongodb-connection-string"
BETTER_AUTH_SECRET="your-better-auth-secret"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
STRIPE_SECRET_KEY="your-stripe-secret-key"
```

### Installation & Run
1. **Start Server:**
   ```bash
   cd AI_Prompt_Server
   npm install
   npm start
   ```
2. **Start Next.js Client:**
   ```bash
   cd AI_Prompt_Client
   npm install
   npm run dev
   ```
   Open `http://localhost:3000` to browse PromptSphere.
