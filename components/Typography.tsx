import React from 'react';
import { Text, TextProps } from 'react-native';
import { styled } from 'nativewind';

const StyledText = styled(Text);

interface TypographyProps extends TextProps {
  children: React.ReactNode;
  className?: string;
}

export const H1: React.FC<TypographyProps> = ({ children, className, ...props }) => (
  <StyledText className={`text-4xl font-bold ${className}`} {...props}>
    {children}
  </StyledText>
);

export const H2: React.FC<TypographyProps> = ({ children, className, ...props }) => (
  <StyledText className={`text-3xl font-bold ${className}`} {...props}>
    {children}
  </StyledText>
);

export const H3: React.FC<TypographyProps> = ({ children, className, ...props }) => (
  <StyledText className={`text-2xl font-bold ${className}`} {...props}>
    {children}
  </StyledText>
);

export const H4: React.FC<TypographyProps> = ({ children, className, ...props }) => (
  <StyledText className={`text-xl font-bold ${className}`} {...props}>
    {children}
  </StyledText>
);

export const P: React.FC<TypographyProps> = ({ children, className, ...props }) => (
  <StyledText className={`text-base ${className}`} {...props}>
    {children}
  </StyledText>
);
