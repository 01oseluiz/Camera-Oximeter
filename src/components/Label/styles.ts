import styled from 'styled-components/native';
import { TextProps } from 'react-native';

import { Theme } from '../../constants';

export interface TextType extends TextProps {
  color?: string,
  fontSize?: string,
  fontFamily?: string,
  fontWeight?: number,
  marginTop?: string,
  marginBottom?: string,
  marginLeft?: string,
  marginRight?: string,
}

export const Text = styled.Text<TextType>`
  color: ${(props) => props.color};
  font-family: ${(props) => props.fontFamily};
  font-size: ${(props) => props.fontSize};
  font-weight: ${(props) => props.fontWeight};
  margin-top: ${(props) => props.marginTop};
  margin-bottom: ${(props) => props.marginBottom};
  margin-left: ${(props) => props.marginLeft};
  margin-right: ${(props) => props.marginRight};
`;

Text.defaultProps = {
  color: Theme.colors.default,
  fontSize: '16px',
  fontFamily: 'Roboto_500Medium',
  fontWeight: 500,
  marginTop: '0px',
  marginBottom: '0px',
  marginLeft: '0px',
  marginRight: '0px',
};
