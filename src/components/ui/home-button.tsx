import React from 'react';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HomeButtonProps {
  className?: string;
}

export const HomeButton: React.FC<HomeButtonProps> = ({ className = "" }) => {
  const navigate = useNavigate();

  return (
    <Button 
      onClick={() => navigate('/')}
      variant="outline" 
      size="sm"
      className={`flex items-center gap-2 ${className}`}
    >
      <Home size={16} />
      Home
    </Button>
  );
};