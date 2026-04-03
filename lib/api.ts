const API_BASE_URL = 'http://localhost:3001/api';
// const API_BASE_URL = 'https://admin.gotlucky.bet/api';

// API Helper Functions
class LuckyCasinoAPI {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Generic request helper
  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      // Check if response is ok before parsing JSON
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if response has content before parsing JSON
      const text = await response.text();
      if (!text) {
        return null;
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.error('Response text:', text);
        throw new Error('Invalid JSON response from server');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      // Return a default structure instead of throwing to prevent crashes
      return {
        data: { bets: [] },
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Authentication
  async login(walletAddress: string) {
    return this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ wallet_address: walletAddress }),
    });
  }

  async getProfile(walletAddress: string) {
    return this.makeRequest(`/auth/profile?wallet_address=${walletAddress}`);
  }

  async updateProfile(walletAddress: string, username: string) {
    return this.makeRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify({ wallet_address: walletAddress, username }),
    });
  }

  // Balance Management
  async getBalance(walletAddress: string) {
    return this.makeRequest(`/balance/balance?wallet_address=${walletAddress}`);
  }

  async getBalanceHistory(walletAddress: string, page: number = 1, limit: number = 10) {
    return this.makeRequest(
      `/balance/history?wallet_address=${walletAddress}&page=${page}&limit=${limit}`
    );
  }

  async getBalanceSummary(walletAddress: string) {
    return this.makeRequest(`/balance/summary?wallet_address=${walletAddress}`);
  }

  // Deduct balance for bet placement
  async deductBalance(walletAddress: string, amount: number, gameType: string = 'blackjack', referenceId?: string) {
    return this.makeRequest('/balance/deduct', {
      method: 'POST',
      body: JSON.stringify({
        wallet_address: walletAddress,
        amount,
        game_type: gameType,
        reference_id: referenceId,
      }),
    });
  }

  // Credit balance for wins and pushes
  async creditBalance(walletAddress: string, amount: number, gameType: string = 'blackjack', resultType: string, referenceId?: string) {
    return this.makeRequest('/balance/credit', {
      method: 'POST',
      body: JSON.stringify({
        wallet_address: walletAddress,
        amount,
        game_type: gameType,
        result_type: resultType,
        reference_id: referenceId,
      }),
    });
  }

  // Deposits
  async createDeposit(walletAddress: string, amount: number, transactionHash?: string) {
    return this.makeRequest('/deposits/create', {
      method: 'POST',
      body: JSON.stringify({
        wallet_address: walletAddress,
        amount,
        transaction_hash: transactionHash,
      }),
    });
  }

  async getDepositHistory(walletAddress: string, page: number = 1, limit: number = 10) {
    return this.makeRequest(
      `/deposits/history?wallet_address=${walletAddress}&page=${page}&limit=${limit}`
    );
  }

  // Withdrawals
  async createWithdrawal(walletAddress: string, amount: number, withdrawalAddress: string) {
    return this.makeRequest('/withdrawals/create', {
      method: 'POST',
      body: JSON.stringify({
        wallet_address: walletAddress,
        amount,
        withdrawal_address: withdrawalAddress,
      }),
    });
  }

  async getWithdrawalHistory(walletAddress: string, page: number = 1, limit: number = 10) {
    return this.makeRequest(
      `/withdrawals/history?wallet_address=${walletAddress}&page=${page}&limit=${limit}`
    );
  }

  // Bets
  async saveBetResult(walletAddress: string, betData: {
    game_type: string;
    bet_amount: number;
    result: 'win' | 'lose' | 'push';
    win_amount?: number;
    game_data?: any;
  }) {
    console.log("saveBetResult", walletAddress, betData)
    return this.makeRequest('/bets/save-result', {
      method: 'POST',
      body: JSON.stringify({
        wallet_address: walletAddress,
        ...betData,
      }),
    });
  }

  async getBetHistory(walletAddress: string, page: number = 1, limit: number = 10, filters: any = {}) {
    const queryParams = new URLSearchParams({
      wallet_address: walletAddress,
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });
    
    return this.makeRequest(`/bets/history?${queryParams}`);
  }

  async getAllBetHistory(page: number = 1, limit: number = 10, filters: any = {}) {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });
    return this.makeRequest(`/bets/all-history?${queryParams}`);
  }

  async getBetStatistics(walletAddress: string) {
    return this.makeRequest(`/bets/statistics?wallet_address=${walletAddress}`);
  }

  async getRecentBets(walletAddress: string, limit: number = 5) {
    return this.makeRequest(`/bets/recent?wallet_address=${walletAddress}&limit=${limit}`);
  }
}

// Create a singleton instance
export const luckyCasinoAPI = new LuckyCasinoAPI();

// React Hook for API Integration
import { useState, useCallback } from 'react';

export const useLuckyCasinoAPI = () => {
  const [api] = useState(() => new LuckyCasinoAPI());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeRequest = useCallback(async <T>(requestFn: () => Promise<T>): Promise<T> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await requestFn();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    api,
    loading,
    error,
    executeRequest,
  };
};

export default LuckyCasinoAPI; 