import styled from 'styled-components/native';
import { TextProps } from 'react-native';

import { Theme } from '../../constants';

export interface TextType extends TextProps {
  color?: string,
  fontSize?: string,
  fontFamily?: string,
  fontWeight?: number,
}

export const Text = styled.Text<TextType>`
  color: ${(props) => props.color};
  font-family: ${(props) => props.fontFamily};
  font-size: ${(props) => props.fontSize};
  font-weight: ${(props) => props.fontWeight};
`;

Text.defaultProps = {
  color: Theme.colors.default,
  fontSize: '16px',
  fontFamily: 'Roboto_500Medium',
  fontWeight: 500,
};
