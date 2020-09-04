import React from 'react';
import { Text, TextType } from './styles';

interface ILabelProps extends TextType {
  children: React.ReactNode,
}

const Label : React.FC<ILabelProps> = ({
  children,
  color,
  fontSize,
  fontFamily,
  fontWeight,
}: ILabelProps) => (
  <Text
    color={color}
    fontSize={fontSize}
    fontFamily={fontFamily}
    fontWeight={fontWeight}
  >
    {children}
  </Text>
);

export default Label;
