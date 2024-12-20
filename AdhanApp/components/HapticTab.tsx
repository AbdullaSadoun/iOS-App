import React from 'react';
import { Pressable } from 'react-native';
import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';

export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <Pressable
      {...props}
      style={[props.style]}
      onPress={(event) => {
        props.onPress?.(event);
      }}
    />
  );
}
