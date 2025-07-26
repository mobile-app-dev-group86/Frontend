// Leaderboard Service for Chat Score
// TODO: Replace with your actual API endpoint
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-api-endpoint.com/api';

export const leaderboardService = {
  // Fetch leaderboard data including current user and friends
  async getLeaderboardData(userId, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/leaderboard/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to fetch leaderboard data`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
      throw error;
    }
  },

  // Fetch user's token balance and activity
  async getUserTokenData(userId, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/tokens`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to fetch user token data`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching user token data:', error);
      throw error;
    }
  },

  // Refresh leaderboard data
  async refreshLeaderboard(userId, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/leaderboard/${userId}/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to refresh leaderboard`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error refreshing leaderboard:', error);
      throw error;
    }
  },
};

// Example API response structure for leaderboard:
/*
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
      "username": "BobBuilder", 
      "tokenBalance": 1890.25,
      "avatar": "https://example.com/avatar2.jpg",
      "isCurrentUser": false,
      "rank": 2,
      "userId": "user456"
    },
    {
      "id": 3,
      "username": "JohnDoe",
      "tokenBalance": 1250.50,
      "avatar": "https://example.com/avatar3.jpg",
      "isCurrentUser": true,
      "rank": 3,
      "userId": "user789"
    }
  ],
  "currentUser": {
    "id": 3,
    "username": "JohnDoe",
    "tokenBalance": 1250.50,
    "rank": 3
  }
}
*/

// Example API response structure for user token data:
/*
{
  "user": {
    "id": "user789",
    "username": "JohnDoe",
    "tokenBalance": 1250.50,
    "avatar": "https://example.com/avatar3.jpg"
  },
  "tokenActivity": [
    {
      "id": 1,
      "type": "earn",
      "amount": 50,
      "date": "2024-01-15",
      "description": "Earned from chat activity"
    },
    {
      "id": 2,
      "type": "earn", 
      "amount": 25,
      "date": "2024-01-14",
      "description": "Earned from game participation"
    },
    {
      "id": 3,
      "type": "redeem",
      "amount": 10,
      "date": "2024-01-13", 
      "description": "Redeemed for rewards"
    }
  ]
}
*/ 