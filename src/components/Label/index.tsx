import React from 'react';
import { Text, TextType } from './styles';

import { Theme } from '../../constants';

/* eslint-disable react/destructuring-assignment */
interface ILabelProps extends TextType {
  children: React.ReactNode,
  styles?: Record<string, unknown>,
}

const Label : React.FC<ILabelProps> = (props: ILabelProps) => (
  <Text
    {...props.styles}
  >
    {props.children}
  </Text>
);

Label.defaultProps = {
  styles: {
    color: Theme.colors.default,
    fontSize: '16px',
    fontFamily: 'Roboto_500Medium',
    fontWeight: 500,
    marginTop: '0px',
    marginBottom: '0px',
    marginLeft: '0px',
    marginRight: '0px',
  },
};

export default Label;
