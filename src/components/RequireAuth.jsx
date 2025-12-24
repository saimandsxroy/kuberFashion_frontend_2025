import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import LoginModal from './LoginModal';

export const RequireAuth = ({ children, action = "perform this action", onAuthSuccess }) => {
  const { isAuthenticated } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const handleClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      e.stopPropagation();
      setShowModal(true);
      return false;
    }
    
    // If authenticated and there's a callback, execute it
    if (onAuthSuccess) {
      onAuthSuccess(e);
    }
    return true;
  };

  // If authenticated, render children normally
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // If not authenticated, wrap with click handler
  return (
    <>
      <div onClick={handleClick} style={{ cursor: 'pointer' }}>
        {children}
      </div>
      {showModal && (
        <LoginModal 
          onClose={() => setShowModal(false)}
          message={`Please login to ${action}`}
        />
      )}
    </>
  );
};

export default RequireAuth;
