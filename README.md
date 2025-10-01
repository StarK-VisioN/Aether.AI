# 🌌 AetherAI
#### 🚀 Live Demo 👉 [AetherAI – Live Project](https://aether-ai-xi.vercel.app/)

AetherAI is a **fully functional AI SaaS platform** built with the **PERN stack** (PostgreSQL, Express, React, Node.js).  
It provides AI-powered tools for **content creation, image editing, and resume analysis**, all integrated with **subscription billing** to unlock premium features.

---

## ✨ Key Features

### 🔐 User Management
- Secure **Sign-up / Sign-in / Profile** with [Clerk](https://clerk.com)
- JWT-based authentication
- Role-based access (Free / Premium)

### 💳 Subscription Billing
- Premium subscription plans  
- Integrated with Stripe for payments  
- Access control for free vs premium AI tools  

### 🗄️ Database
- **Serverless PostgreSQL** powered by [Neon](https://neon.tech)  
- Stores user profiles, subscription data, and usage history  

---

## 🤖 AI Features

### 📝 Text & Content
- **Article Generator** → Provide a title & length, get a full AI-generated article  
- **Blog Title Generator** → Enter a keyword & category to generate blog titles  

### 🎨 Image Tools
- **Image Generator** → Enter a prompt to generate custom AI images  
- **Background Remover** → Upload an image, get a transparent background  
- **Object Remover** → Upload an image & remove unwanted objects with AI  

### 📄 Resume Tools
- **Resume Analyzer** → Upload a resume (PDF/DOCX) and receive AI-driven insights & suggestions  

---

## 🛠️ Tech Stack

- **Frontend:** React + TailwindCSS  
- **Backend:** Node.js + Express  
- **Database:** PostgreSQL (Neon)  
- **Authentication:** Clerk  
- **Payments:** Stripe Subscriptions  
- **AI Models:** OpenAI / Replicate / Custom APIs  
- **Deployment:** Vercel (Frontend) + Railway/Render (Backend)  

---

## 🚀 Getting Started

### 1️⃣ Clone Repository
```bash
git clone https://github.com/your-username/aetherai.git
cd aetherai
