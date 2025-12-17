import React from 'react';
import { View, ViewProps } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);

interface ContainerProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({ children, className, ...props }) => (
  <StyledView className={`px-4 ${className}`} {...props}>
    {children}
  </StyledView>
);
