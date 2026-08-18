import React, { useRef } from "react";
import { Pressable, Animated, PressableProps, StyleProp, ViewStyle } from "react-native";

type Props = Omit<PressableProps, "style"> & {
  style?: StyleProp<ViewStyle> | StyleProp<ViewStyle>[];
  scaleTo?: number;
  children: React.ReactNode;
};

export default function PressableScale({
  onPressIn,
  onPressOut,
  style,
  scaleTo = 0.96,
  children,
  disabled,
  ...rest
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (value: number) => {
    Animated.spring(scale, {
      toValue: value,
      useNativeDriver: true,
      speed: 40,
      bounciness: 6,
    }).start();
  };

  return (
    <Pressable
      disabled={disabled}
      onPressIn={(e) => {
        if (!disabled) animateTo(scaleTo);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        if (!disabled) animateTo(1);
        onPressOut?.(e);
      }}
      {...rest}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
