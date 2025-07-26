# Token System Integration Guide

## 🚀 Quick Setup

### 1. Update API Base URL
In `app/services/leaderboardService.js`:
```javascript
const API_BASE_URL = 'https://your-actual-backend.com/api';
```

### 2. Enable Real Data in Token.js
Replace the commented code in `app/Token.js`:

```javascript
// Replace this:
// const userData = await leaderboardService.getUserTokenData(userId);
// const leaderboardData = await leaderboardService.getLeaderboardData(userId);

// With this:
const userData = await leaderboardService.getUserTokenData(userId, authToken);
const leaderboardData = await leaderboardService.getLeaderboardData(userId, authToken);
```

### 3. Get User ID and Auth Token
Add to your authentication context or get from storage:
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

const userId = await AsyncStorage.getItem('userId');
const authToken = await AsyncStorage.getItem('authToken');
```

## 📊 Expected API Responses

### User Token Data Endpoint: `GET /users/{userId}/tokens`
```json
{
  "user": {
    "id": "user123",
    "username": "JohnDoe",
    "tokenBalance": 1250.50,
    "avatar": "https://example.com/avatar.jpg"
  },
  "tokenActivity": [
    {
      "id": 1,
      "type": "earn",
      "amount": 50,
      "date": "2024-01-15",
      "description": "Earned from chat activity"
    }
  ]
}
```

### Leaderboard Endpoint: `GET /leaderboard/{userId}`
```json
{
  "leaderboard": [
    {
      "id": 1,
      "username": "AliceWonder",
      "tokenBalance": 2150.75,
      "avatar": "https://example.com/avatar1.jpg",
      "isCurrentUser": false,
      "rank": 1,
      "userId": "user123"
    },
    {
      "id": 2,
      "username": "JohnDoe",
      "tokenBalance": 1250.50,
      "avatar": "https://example.com/avatar2.jpg",
      "isCurrentUser": true,
      "rank": 2,
      "userId": "user456"
    }
  ],
  "currentUser": {
    "id": 2,
    "username": "JohnDoe",
    "tokenBalance": 1250.50,
    "rank": 2
  }
}
```

## 🔧 Backend Requirements

### Database Tables Needed:
```sql
-- Users table (existing)
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  avatar VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tokens table
CREATE TABLE user_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  token_balance DECIMAL(10,2) DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Token activity table
CREATE TABLE token_activity (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  type ENUM('earn', 'redeem', 'bonus') NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Friends table (for leaderboard)
CREATE TABLE user_friends (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  friend_id VARCHAR(255) NOT NULL,
  status ENUM('pending', 'accepted', 'blocked') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (friend_id) REFERENCES users(id)
);
```

### API Endpoints to Implement:

1. **GET /users/{userId}/tokens** - Get user's token balance and activity
2. **GET /leaderboard/{userId}** - Get leaderboard with friends
3. **POST /leaderboard/{userId}/refresh** - Refresh leaderboard data
4. **POST /tokens/earn** - Award tokens to user
5. **POST /tokens/redeem** - Deduct tokens from user

## 🎯 Token Earning Logic

### Suggested Token Rewards:
- **Message sent**: +1 token
- **Voice call joined**: +5 tokens
- **Game played**: +10 tokens
- **Game won**: +50 tokens
- **Daily login**: +20 tokens
- **Friend added**: +15 tokens
- **Server created**: +100 tokens

### Implementation Example:
```javascript
// When user sends a message
await fetch('/api/tokens/earn', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({
    userId: currentUserId,
    type: 'earn',
    amount: 1,
    description: 'Message sent'
  })
});
```

## 🔒 Security Considerations

1. **Token Validation**: Verify JWT tokens on all endpoints
2. **Rate Limiting**: Prevent token farming
3. **Anti-Cheat**: Validate token earning activities
4. **Data Validation**: Sanitize all inputs
5. **CORS**: Configure proper CORS headers

## 🚀 Testing

1. **Test with real user data**
2. **Verify leaderboard rankings**
3. **Test token earning scenarios**
4. **Check error handling**
5. **Test refresh functionality**

## 📱 Features Ready to Use

✅ **Leaderboard UI** - Complete with rankings and medals
✅ **Token Balance Display** - Shows current balance
✅ **Activity History** - Lists token transactions
✅ **Refresh Button** - Updates data in real-time
✅ **Error Handling** - Graceful fallbacks
✅ **Loading States** - User feedback during API calls
✅ **Friend Integration** - Shows friends in leaderboard
✅ **Current User Highlighting** - Shows your position

Just connect your backend APIs and you're ready to go! 🎉 