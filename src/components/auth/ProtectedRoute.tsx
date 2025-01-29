import { Navigate } from 'react-router-dom';
import React from 'react';
import { useAuth } from '../../client/contexts/AuthContext';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return { children };
}

export default ProtectedRoute;
