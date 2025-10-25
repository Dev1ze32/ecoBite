# 🌱 EcoBite - Fighting Food Waste Together

<div align="center">

![EcoBite Logo](https://via.placeholder.com/150x150/4ECDC4/FFFFFF?text=🌱+EcoBite)

**A smart food management app that helps households and restaurants reduce food waste, save money, and protect the planet.**

[![React Native](https://img.shields.io/badge/React%20Native-0.74-61DAFB?logo=react)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK%2051-000020?logo=expo)](https://expo.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[Features](#-features) • [Installation](#-installation) • [Configuration](#-configuration) • [Usage](#-usage) • [Tech Stack](#-tech-stack)

</div>

---

## 📖 About

EcoBite is a comprehensive food waste reduction platform that empowers users to:
- 📦 **Track inventory** with expiry date monitoring
- 🤖 **Get AI-powered suggestions** for meal planning and recipes
- 💰 **Save money** by reducing food waste
- 🌍 **Make environmental impact** by preventing food from going to landfills
- 🏠 **Household mode** for families and individuals
- 🍽️ **Restaurant mode** for food businesses

---

## ✨ Features

### 🔐 User Authentication
- Secure registration with email and password
- User type selection (Household/Restaurant)
- Persistent login sessions with AsyncStorage
- Profile management

### 🤖 AI Assistant (Smart Meal Plan)
- **Multi-conversation support** - Organize chats by topic (recipes, meal plans, storage tips)
- **Real-time AI responses** via n8n webhook integration
- **Personalized suggestions** based on user type (household vs restaurant)
- **Conversation history** stored in Supabase
- **Session continuity** - AI remembers context within each conversation
- Helpful quick suggestions for common queries

### 📊 Dashboard
- Real-time impact statistics (food saved, money saved, CO₂ reduced)
- Soon-to-expire items alerts
- Quick access to all features
- Beautiful, intuitive UI

### 🗄️ Inventory Management
- Track food items with expiry dates
- Smart notifications for expiring items
- Category-based organization
- Easy add/edit/delete operations

### 💸 Money Saved Tracker
- Visual charts showing savings over time
- Total savings calculations
- Historical data tracking

### 🌍 Environmental Impact
- CO₂ reduction metrics
- Food waste statistics
- Contribution to sustainability goals

### 🛒 Shopping Cart
- Plan purchases based on inventory
- Avoid duplicate buying
- Smart shopping lists

---

## 🚀 Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Git

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ecobite-app.git
   cd ecobite-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Install Expo CLI globally** (if not already installed)
   ```bash
   npm install -g expo-cli
   ```

4. **Install required packages**
   ```bash
   expo install @react-native-async-storage/async-storage
   expo install @supabase/supabase-js
   expo install react-native-url-polyfill
   ```

---

## ⚙️ Configuration

### 1. Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# AI Webhook Configuration
EXPO_PUBLIC_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-webhook-id
EXPO_PUBLIC_WEBHOOK_KEY=your_webhook_key_here
```

### 2. Supabase Setup

#### Database Schema

Run this SQL in your Supabase SQL Editor:

```sql
-- Users table
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR UNIQUE NOT NULL,
  password TEXT NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  first_name VARCHAR,
  last_name VARCHAR,
  user_type VARCHAR CHECK (user_type IN ('household', 'restaurant')),
  user_plan VARCHAR DEFAULT 'free',
  auth_uuid UUID REFERENCES auth.users(id)
);

-- Conversations table
CREATE TABLE "Conversations" (
  conversation_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(user_id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  title TEXT NOT NULL,
  updated_at TIMESTAMPTZ
);

-- Messages table
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  conversation_id INTEGER REFERENCES "Conversations"(conversation_id),
  sender TEXT CHECK (sender IN ('user', 'ai')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS for development (or add proper policies)
ALTER TABLE "Conversations" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "messages" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "users" DISABLE ROW LEVEL SECURITY;
```

#### Indexes for Performance

```sql
CREATE INDEX idx_conversations_user_id ON "Conversations"(user_id);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
```

### 3. AI Webhook Setup (n8n)

Your n8n workflow should:
- Accept POST requests with `sessionId` and `message`
- Process the message with your AI model (OpenAI, Claude, etc.)
- Return JSON with `ai_reply` field

Example response format:
```json
{
  "ai_reply": "Here's your AI response..."
}
```

---

## 🎮 Usage

### Start the Development Server

```bash
npx expo start
```

Then press:
- `a` - Open on Android
- `i` - Open on iOS simulator
- `w` - Open in web browser

### Using the App

#### 1. **Sign Up / Login**
- Open the app
- Click "Sign Up" to create an account
- Choose account type (Household or Restaurant)
- Fill in your details

#### 2. **Dashboard**
- View your impact statistics
- See soon-to-expire items
- Access all features

#### 3. **Smart Meal Plan (AI Assistant)**
- Tap "Smart Meal Plan" from the home screen
- Start a conversation or create a new topic tab
- Ask questions like:
  - "What recipes can I make with leftover vegetables?"
  - "Create a meal plan for a family of 4"
  - "How to store fresh herbs?"
- Get personalized responses based on your user type
- Switch between conversation tabs to organize topics

#### 4. **Inventory Management**
- Add food items with expiry dates
- Track what you have
- Get alerts for expiring items

---

## 🛠️ Tech Stack

### Frontend
- **React Native** - Mobile app framework
- **Expo** - Development platform
- **AsyncStorage** - Local data persistence
- **React Hooks** - State management

### Backend & Database
- **Supabase** - Backend as a Service
  - PostgreSQL database
  - Real-time subscriptions
  - Row Level Security (RLS) [to be implemented]
  - Authentication (optional)

### AI Integration
- **n8n** - Workflow automation
- **Custom webhook** - AI processing
- **Session management** - Conversation context

### Authentication
- Custom authentication system
- Password storage (⚠️ plaintext in development - use Supabase Auth for production)
- User session management with AsyncStorage

---

## 📁 Project Structure

```
ecobite-app/
├── data/
│   ├── AuthContext.js          # Global auth state management
│   ├── auth.js                 # Login/register functions
│   ├── supabase.js             # Supabase client configuration
│   └── ai_webhook.js           # AI webhook integration
├── screens/
│   ├── LoginScreen.js          # Authentication screen
│   ├── SmartMealPlanScreen.js  # AI chat interface
│   ├── InventoryScreen.js      # Inventory management
│   ├── ProfileScreen.js        # User profile
│   ├── MoneySavedScreen.js     # Savings tracking
│   ├── MyImpactScreen.js       # Environmental impact
│   ├── CartScreen.js           # Shopping cart
│   └── DonationScreen.js       # Food donation
├── styles/
│   ├── SmartMealPlanScreenStyles.js
│   └── loginScreenStyle.js
├── App.js                      # Main app component
├── app.config.js               # Expo configuration
├── .env                        # Environment variables
├── package.json                # Dependencies
└── README.md                   # This file
```

---

## 🔑 Key Features Explained

### Smart Meal Plan AI Assistant

**Multi-Conversation Tabs:**
- Create separate conversations for different topics
- Each tab maintains its own context
- Switch between conversations seamlessly
- Long-press to delete tabs

**Personalized AI:**
- Household users get family-friendly suggestions
- Restaurant users get bulk/commercial recipes
- Responses tailored to expiring inventory
- Context-aware recommendations

**Data Persistence:**
- All conversations saved to Supabase
- Messages loaded on app start
- Conversation history maintained across sessions

### Authentication Flow

```
User Registration
    ↓
Account Created in Supabase
    ↓
Login with Credentials
    ↓
Session Saved to AsyncStorage
    ↓
Auto-login on App Restart
```

---

## 🔒 Security Notes

### Current Implementation (Development)
- ⚠️ Passwords stored as plaintext
- Custom authentication system
- Local session management

### Recommended for Production
- ✅ Migrate to Supabase Auth
- ✅ Bcrypt password hashing
- ✅ JWT token authentication
- ✅ Email verification
- ✅ Password reset flow
- ✅ Enable RLS policies

---

## 🐛 Troubleshooting

### Common Issues

**1. "Missing Supabase environment variables"**
- Make sure `.env` file exists in root directory
- Restart Expo with `npx expo start --clear`

**2. "Row Level Security policy violation"**
- Run `ALTER TABLE "Conversations" DISABLE ROW LEVEL SECURITY;` in Supabase
- Or add proper RLS policies (see Configuration section)

**3. "sendWebhook is not a function"**
- Make sure `ai_webhook.js` has `export` keywords
- Check import path is correct
- Restart development server

**4. "User session not loading"**
- Clear app data
- Reinstall the app
- Check AsyncStorage permissions

**5. AI not responding**
- Verify webhook URL in `.env`
- Check n8n workflow is active
- Verify webhook key matches

---

## 🚧 Roadmap

- [ ] Migrate to Supabase Auth for better security
- [ ] Add social login (Google, Apple)
- [ ] Implement barcode scanning for inventory
- [ ] Add recipe image generation
- [ ] Nutrition tracking
- [ ] Community features (share recipes)
- [ ] Push notifications for expiring items
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Export data functionality

---

## 👥 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---


## 🙏 Acknowledgments

- **Supabase** - For the amazing backend platform
- **n8n** - For powerful workflow automation
- **Expo** - For simplifying React Native development
- **OpenAI/Claude** - For AI capabilities
- All contributors and testers

---

<div align="center">

**Made with ❤️ by the EcoBite Team**

[⬆ Back to Top](#-ecobite---fighting-food-waste-together)

</div>
