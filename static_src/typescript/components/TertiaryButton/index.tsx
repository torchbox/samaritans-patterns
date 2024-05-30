import React from 'react';

import Button, { ButtonProps } from 'components/Button';
import StyledTertiaryButton from './styled';

const TertiaryButton = ({ StyledComponent: _, ...props }: ButtonProps) => (
    <Button StyledComponent={StyledTertiaryButton} {...props} />
);
TertiaryButton.defaultProps = Button.defaultProps;

export default TertiaryButton;
