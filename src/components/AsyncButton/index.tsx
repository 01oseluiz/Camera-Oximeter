import React, { useState } from 'react';

import { ActivityIndicator, GestureResponderEvent } from 'react-native';
import { Button, ButtonType } from './styles';

interface IButtonProps extends ButtonType {
  children: React.ReactNode,
  asyncAction: boolean,
  callback: <GestureResponderEvent>(arg: GestureResponderEvent) => void,
}

const AsyncButton : React.FC<IButtonProps> = (props : IButtonProps) => {
  const [disabled, setDisabled] = useState(false);
  const { children, asyncAction, callback } = props;

  let onPressCallback;
  if (asyncAction) {
    onPressCallback = async (event: GestureResponderEvent) => {
      setDisabled(true);
      await callback(event);
      setDisabled(false);
    };
  } else {
    onPressCallback = callback;
  }

  return (
    <Button
      onPress={onPressCallback}
      disabled={disabled}
      {...props}
    >
      {(asyncAction && disabled) && <ActivityIndicator />}
      {children}
    </Button>
  );
};

export default AsyncButton;
