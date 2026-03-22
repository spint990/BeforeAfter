'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

interface AdminContextType {
  pendingCount: number;
  refreshPendingCount: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [pendingCount, setPendingCount] = useState(0);

  const refreshPendingCount = useCallback(async () => {
    try {
      const [gamesRes, photosRes] = await Promise.all([
        fetch('/api/submissions/games?status=pending'),
        fetch('/api/submissions/photos?status=pending'),
      ]);
      
      let count = 0;
      if (gamesRes.ok) {
        const gamesData = await gamesRes.json();
        count += gamesData.length || 0;
      }
      if (photosRes.ok) {
        const photosData = await photosRes.json();
        count += photosData.total || photosData.submissions?.length || 0;
      }
      
      setPendingCount(count);
    } catch (error) {
      console.error('Error fetching pending count:', error);
    }
  }, []);

  useEffect(() => {
    refreshPendingCount();
  }, [refreshPendingCount]);

  return (
    <AdminContext.Provider value={{ pendingCount, refreshPendingCount }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
