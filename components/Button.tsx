import React, { useState } from 'react';
import {
  Pressable,
  Text,
  TouchableOpacityProps,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';

import { cn } from '../lib/utils';

import { buttonClassNames, textClassNames, iconColors } from './styles/button';

interface ButtonProps extends TouchableOpacityProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  className?: string;
  textClassName?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  mode?: 'light' | 'dark';
  children: React.ReactNode;
  asChild?: boolean;
}

// Type for icon elements
interface IconElement extends React.ReactElement {
  props: {
    svg?: boolean;
    color?: string;
    className?: string;
    [key: string]: any;
  };
  type: string | React.JSXElementConstructor<any>;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'default',
  size = 'default',
  disabled = false,
  className = '',
  textClassName = '',
  style,
  mode = 'light',
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const containerClasses = cn(
    buttonClassNames.base,
    buttonClassNames[`size_${size}`],
    buttonClassNames[`${mode}_variant_${variant}`],
    isPressed && buttonClassNames.pressed[variant],
    disabled && buttonClassNames.disabled,
    className
  );

  const textClasses = cn(
    textClassNames.base,
    textClassNames.size[size],
    textClassNames[mode][variant],
    textClassName
  );

  const isIconButton = size === 'icon';

  // Extract accessibility props or generate default
  const accessibilityLabel = props.accessibilityLabel || 
    (typeof children === 'string' ? children : undefined);
  const accessibilityRole = props.accessibilityRole || 'button';
  
  // Add hitSlop for better touch targets (minimum 44x44 points)
  const hitSlop = props.hitSlop || { top: 10, bottom: 10, left: 10, right: 10 };

  // Destructure and filter out invalid props that React Native doesn't recognize
  const {
    accessibilityLabel: _accessibilityLabel,
    accessibilityRole: _accessibilityRole,
    accessibilityHint,
    hitSlop: _hitSlop,
    title, // Remove title prop if present (use children instead)
    asChild, // Remove asChild prop (not used in React Native)
    textStyle, // Remove textStyle (handled via textClassName)
    ...validProps
  } = props;

  return (
    <Pressable
      {...validProps}
      disabled={disabled}
      accessible={true}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      accessibilityHint={accessibilityHint}
      hitSlop={hitSlop}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      android_ripple={variant !== 'link' ? { color: 'rgba(0, 0, 0, 0.1)' } : null}
      className={containerClasses}
      style={[style, isPressed && !buttonClassNames.pressed[variant] && { opacity: 0.95 }]}
    >
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          const elementChild = child as IconElement;

          if (elementChild.type === 'svg' || elementChild.props.svg) {
            return React.cloneElement(elementChild, {
              ...elementChild.props,
              size: isIconButton ? 20 : 16,
              color: elementChild.props.color || iconColors[mode][variant],
              className: cn(
                isIconButton ? 'w-5 h-5' : 'w-4 h-4 shrink-0',
                elementChild.props.className
              ),
            });
          }
        }

        if (typeof child === 'string' || typeof child === 'number') {
          return <Text className={textClasses}>{child}</Text>;
        }

        return child;
      })}
    </Pressable>
  );
};

export default Button;
