import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';

interface IconProps {
  name: string;
  color?: string;
  size?: number;
}

export function IconSymbol({ name, color, size = 24 }: IconProps) {
  const iconColor = useThemeColor({ light: color, dark: color }, 'text');
  
  const getIconName = (name: string): any => {
    switch (name) {
      case 'clock':
        return 'time-outline';
      case 'cog':
        return 'settings-outline';
      case 'compass':
        return 'compass-outline';
      default:
        return name;
    }
  };

  return <Ionicons name={getIconName(name)} size={size} color={iconColor} />;
}
