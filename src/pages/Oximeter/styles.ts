import styled from 'styled-components/native';
import { ViewProps, TextProps } from 'react-native';

import { Theme } from '../../constants';

export const CameraContainer = styled.View<ViewProps>`
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
`;

export const PermissionContainer = styled.View<ViewProps>`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 70%;
`;

export const PermissionText = styled.Text<TextProps>`
  text-align: center;
  justify-content: center;
  color: ${Theme.colors.dark};
  font-family: 'Roboto_700Bold';
  font-weight: 500;
  font-size: 22px;
`;
