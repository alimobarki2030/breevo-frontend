import React, { useState, useEffect } from 'react';
import { Coins } from 'lucide-react';

import { API_BASE_URL } from '../../config/api';

export default function PointsBalance() {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/points/balance`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setBalance(data.balance);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 bg-gray-100 text-gray-600 px-3 py-1 rounded-full animate-pulse">
        <Coins className="w-4 h-4" />
        <span className="w-12 h-4 bg-gray-300 rounded"></span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors cursor-pointer">
      <Coins className="w-4 h-4" />
      <span className="font-semibold">{balance.toLocaleString()}</span>
      <span className="text-sm">نقطة</span>
    </div>
  );
}