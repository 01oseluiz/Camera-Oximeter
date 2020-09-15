import React, { useState } from 'react';

import { ActivityIndicator, GestureResponderEvent } from 'react-native';
import { Button, ButtonType } from './styles';
import { Theme } from '../../constants';

interface IButtonProps extends ButtonType {
  children: React.ReactNode,
  asyncAction: boolean,
  callback: <GestureResponderEvent>(arg: GestureResponderEvent) => void,
  activityIndicator?: Record<string, unknown>,
  styles?: Record<string, unknown>,
}

const AsyncButton : React.FC<IButtonProps> = (props : IButtonProps) => {
  const [disabled, setDisabled] = useState(false);
  const {
    activityIndicator, asyncAction, children, callback, styles,
  } = props;

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
      {...styles}
    >
      {(asyncAction && disabled) && <ActivityIndicator {...activityIndicator} />}
      {!(asyncAction && disabled) && children}
    </Button>
  );
};

AsyncButton.defaultProps = {
  activityIndicator: {
    size: 'small',
    color: Theme.colors.light,
  },
  styles: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.primary,
    marginTop: '0px',
    marginBottom: '0px',
    marginLeft: '0px',
    marginRight: '0px',
    borderRadius: '0px',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export default AsyncButton;
