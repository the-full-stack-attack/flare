import { Navigate, Outlet } from 'react-router-dom';
import React from 'react';
import { useAuth } from '../../client/contexts/AuthContext';
import { NavBar } from '@/client/components/NavBar';

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-pink-900 relative overflow-hidden pt-20 pb-12">
        <div className="flex items-center justify-center w-screen pt-40">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent">
            Loading...
          </h1>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}
