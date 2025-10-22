import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean; // Optional - allows public routes to use this component
  fallbackPath?: string; // Customizable redirect path
  showLoading?: boolean; // Show loading spinner during auth check
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true,
  fallbackPath = '/auth/sign-in',
  showLoading = true
}) => {
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const location = useLocation();

  // 🚨 ENHANCED: Show loading state during authentication check
  if (authLoading && showLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground animate-pulse">
            VyaparGuru लोड हो रहा है... • Loading VyaparGuru...
          </p>
        </div>
      </div>
    );
  }

  // 🚨 ENHANCED: Handle authentication requirement
  if (requireAuth && !isAuthenticated) {
    console.log(`[ProtectedRoute] Redirecting unauthenticated user from ${location.pathname} to ${fallbackPath}`);
    
    // Store the attempted URL for redirect after login
    return (
      <Navigate 
        to={fallbackPath} 
        state={{ from: location.pathname }}
        replace 
      />
    );
  }

  // 🚨 NEW: Handle inverse auth (redirect authenticated users away from auth pages)
  if (!requireAuth && isAuthenticated) {
    console.log(`[ProtectedRoute] Redirecting authenticated user from ${location.pathname} to dashboard`);
    return <Navigate to="/dashboard" replace />;
  }

  // 🚨 ENHANCED: Log successful access for debugging
  if (requireAuth && isAuthenticated) {
    console.log(`[ProtectedRoute] Authenticated user ${user?.id?.substring(0, 8)}*** accessing ${location.pathname}`);
  }

  return <>{children}</>;
};

// 🚨 NEW: Enhanced component with subscription checking
interface SubscriptionProtectedRouteProps {
  children: React.ReactNode;
  requireSubscription?: boolean;
  allowTrialAccess?: boolean;
  fallbackPath?: string;
}

export const SubscriptionProtectedRoute: React.FC<SubscriptionProtectedRouteProps> = ({
  children,
  requireSubscription = true,
  allowTrialAccess = true,
  fallbackPath = '/pricing'
}) => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const location = useLocation();

  // First check authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/sign-in" state={{ from: location.pathname }} replace />;
  }

  // If subscription is required, wrap with SubscriptionGuard
  if (requireSubscription) {
    // Import SubscriptionGuard dynamically to avoid circular dependencies
    const SubscriptionGuard = React.lazy(() => 
      import('@/components/SubscriptionGuard').then(module => ({ 
        default: module.SubscriptionGuard 
      }))
    );

    return (
      <React.Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }>
        <SubscriptionGuard>
          {children}
        </SubscriptionGuard>
      </React.Suspense>
    );
  }

  return <>{children}</>;
};

// 🚨 NEW: Admin-only route protection
interface AdminProtectedRouteProps {
  children: React.ReactNode;
  adminEmails?: string[];
}

export const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({
  children,
  adminEmails = [
    'founder@vyaparguru.info',
    'admin@vyaparguru.info',
    // Add your admin emails here
  ]
}) => {
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/sign-in" state={{ from: location.pathname }} replace />;
  }

  // Check if user is admin
  const isAdmin = adminEmails.includes(user?.email || '');
  
  if (!isAdmin) {
    console.warn(`[AdminProtectedRoute] Non-admin user ${user?.email} attempted to access ${location.pathname}`);
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-destructive mb-2">
              Access Denied
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              You don't have permission to access this admin area.
            </p>
            <button 
              onClick={() => window.history.back()}
              className="text-primary hover:underline"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// 🚨 NEW: Route wrapper that handles multiple protection levels
interface SmartProtectedRouteProps {
  children: React.ReactNode;
  protection: 'public' | 'auth' | 'subscription' | 'admin';
  customFallback?: string;
}

export const SmartProtectedRoute: React.FC<SmartProtectedRouteProps> = ({
  children,
  protection,
  customFallback
}) => {
  switch (protection) {
    case 'public':
      return <>{children}</>;
    
    case 'auth':
      return (
        <ProtectedRoute fallbackPath={customFallback}>
          {children}
        </ProtectedRoute>
      );
    
    case 'subscription':
      return (
        <SubscriptionProtectedRoute fallbackPath={customFallback}>
          {children}
        </SubscriptionProtectedRoute>
      );
    
    case 'admin':
      return (
        <AdminProtectedRoute>
          {children}
        </AdminProtectedRoute>
      );
    
    default:
      return <>{children}</>;
  }
};
