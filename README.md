<div align="center">
  
# 💰 SmartEarn Pro

### Rewards & Micro-Earning Progressive Web App

[![Version](https://img.shields.io/badge/version-1.0.0-00ff88.svg)](https://github.com/smartearnpro)
[![License](https://img.shields.io/badge/license-Proprietary-red.svg)](LICENSE)
[![PWA](https://img.shields.io/badge/PWA-Ready-00f5ff.svg)](https://web.dev/progressive-web-apps/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-61dafb.svg)](https://reactjs.org/)

<img src="public/images/logo.svg" alt="SmartEarn Pro Logo" width="150" height="150" />

**A production-ready, Play Store compliant micro-earning PWA**

[Live Demo](https://smartearnpro.app) · [Report Bug](https://github.com/smartearnpro/issues) · [Request Feature](https://github.com/smartearnpro/issues)

</div>

---

## 📖 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Earning Methods](#-earning-methods)
- [Monetization](#-monetization)
- [Security & Fraud Prevention](#-security--fraud-prevention)
- [PWA Features](#-pwa-features)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Disclaimer](#-disclaimer)

---

## 🎯 About

**SmartEarn Pro** is a legitimate, transparent micro-earning Progressive Web App that allows users to earn rewards through various activities like watching rewarded ads, daily check-ins, spin wheel, completing tasks, and referrals.

### Philosophy

- ✅ **100% Legal & Transparent** - No fake earnings or misleading promises
- ✅ **Play Store Compliant** - Follows all Google Play policies
- ✅ **Real Value Exchange** - Users earn for genuine engagement
- ✅ **Clear Disclaimers** - Earnings depend on availability and usage
- ✅ **Ethical Monetization** - No exploitative mechanics

---

## ✨ Features

### 🏠 Core Features
- **Splash Screen** - Animated loading with branding
- **Multi-Language** - English & Hindi support
- **Onboarding** - 3-step introduction to app features
- **Authentication** - Google Sign-In & Guest Mode

### 💵 Earning Methods
| Method | Description | Limits |
|--------|-------------|--------|
| 📺 Watch Ads | Rewarded video ads | 20/day |
| 📅 Daily Check-In | Consecutive day bonuses | 1/day |
| 🎡 Spin Wheel | Luck-based rewards | 3/day |
| ✅ Tasks | Complete offers/surveys | Varies |
| 👥 Referrals | Invite friends & earn | Unlimited |

### 💳 Wallet System
- **Pending Balance** - Earnings under review
- **Approved Balance** - Ready for withdrawal
- **Transaction History** - Complete earnings log
- **Withdrawal Options** - UPI, Paytm, Gift Cards

### ⚙️ Additional Features
- **Push Notifications** - Daily reminders & updates
- **Settings** - Language, privacy, support
- **Exit Confirmation** - Double-back to exit
- **Offline Support** - PWA caching

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI Library |
| TypeScript | Type Safety |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| Zustand | State Management |
| Vite | Build Tool |

### Backend & Services
| Service | Purpose |
|---------|---------|
| Firebase Auth | Authentication |
| Firebase Firestore | Database |
| Firebase Storage | File Storage |
| Google AdMob | Monetization |

### PWA
| Feature | Implementation |
|---------|----------------|
| Service Worker | Workbox (vite-plugin-pwa) |
| Caching | Runtime & Precaching |
| Install Prompt | Custom UI |
| Offline Mode | Cached Assets |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm 9+ or yarn
- Firebase Project
- AdMob Account

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/smartearn-pro.git
cd smartearn-pro

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your Firebase & AdMob credentials

# 4. Start development server
npm run dev

# 5. Open in browser
# http://localhost:3000
