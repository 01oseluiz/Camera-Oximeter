import styled from 'styled-components/native';
import { ViewProps, TextProps, TouchableOpacityProps } from 'react-native';

import Constants from 'expo-constants';

import { Theme } from '../../constants';

const { statusBarHeight } = Constants;

export const CameraContainer = styled.View<ViewProps>`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const CameraOverlay = styled.View<ViewProps>`
  flex: 1;
  flex-direction: row;
  background-color: transparent;
`;

export const BottomBar = styled.View<ViewProps>`
  padding-bottom: 5px;
  background-color: transparent;
  align-self: flex-end;
  justify-content: space-evenly;
  align-items: center;
  flex: 1;
  flex-direction: row;
  height: ${statusBarHeight * 2}px;
`;

export const CameraButton = styled.TouchableOpacity<TouchableOpacityProps>`
  flex: 0.15;
  justify-content: center;
  align-items: center;
  border-width: 2px;
  border-color: ${Theme.colors.light};
  border-radius: ${statusBarHeight}px;
  height: 100%;
  background-color: transparent;
`;

export const PermissionContainer = styled.View<ViewProps>`
  flex: 1;
  flex-direction: column;
  align-self: center;
  align-items: center;
  justify-content: center;
  max-width: 70%;
`;

export const PermissionText = styled.Text<TextProps>`
  text-align: center;
  justify-content: center;
  color: ${Theme.colors.dark};
  font-family: 'Roboto_700Bold';
  font-weight: 500;
  font-size: 22px;
`;
