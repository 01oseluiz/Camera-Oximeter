import styled from 'styled-components/native';
import { ViewProps, TextProps } from 'react-native';

import { Theme } from '../../constants';

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
