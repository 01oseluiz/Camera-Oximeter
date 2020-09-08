import styled from 'styled-components/native';
import { TouchableOpacityProps } from 'react-native';

import { Theme } from '../../constants';

export interface ButtonType extends TouchableOpacityProps {
  flex?: number,
  flexDirection?: string,
  width?: string,
  height?: string,
  backgroundColor?: string,
  marginTop?: string,
  marginBottom?: string,
  marginLeft?: string,
  marginRight?: string,
  borderRadius?: string,
  alignSelf?: string,
  alignItems?: string,
  justifyContent?: string,
}

export const Button = styled.TouchableOpacity<ButtonType>`
  flex: ${(props) => props.flex};
  flex-direction: ${(props) => props.flexDirection};
  width: ${(props) => props.width};
  max-height: ${(props) => props.height};
  background-color: ${(props) => props.backgroundColor};
  margin-top: ${(props) => props.marginTop};
  margin-bottom: ${(props) => props.marginBottom};
  margin-left: ${(props) => props.marginLeft};
  margin-right: ${(props) => props.marginRight};
  border-radius: ${(props) => props.borderRadius};
  align-self: ${(props) => props.alignSelf};
  align-items: ${(props) => props.alignItems};
  justify-content: ${(props) => props.justifyContent};
`;

Button.defaultProps = {
  flex: 1,
  flexDirection: 'row',
  width: '40%',
  height: '35px',
  backgroundColor: Theme.colors.primary,
  marginTop: '0px',
  marginBottom: '0px',
  marginLeft: '0px',
  marginRight: '0px',
  borderRadius: '0px',
  alignSelf: 'center',
  alignItems: 'center',
  justifyContent: 'center',
};
