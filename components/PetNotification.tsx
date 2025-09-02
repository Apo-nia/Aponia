import React from 'react';

interface PetNotificationProps {
  notification: string | null;
}

const PetNotification: React.FC<PetNotificationProps> = ({ notification }) => {
  if (!notification) return null;
  return (
    <div style={{ position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)', background: '#fff', color: '#333', padding: '8px 16px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', fontWeight: 500, zIndex: 10 }}>
      {notification}
    </div>
  );
};

export default PetNotification;
