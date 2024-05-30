import React, { ReactNode } from 'react';

import StyledButton from './styled';

type Props = {
    action: () => void;
    children: ReactNode;
    dataIdentifier?: string;
} & typeof defaultProps;

const defaultProps = {
    disabled: false,
    secondary: false,
    StyledComponent: StyledButton,
};

const Button = ({
    action,
    children,
    disabled,
    secondary,
    dataIdentifier,
    StyledComponent,
}: Props) => (
    <StyledComponent
        onClick={() => action()}
        disabled={disabled}
        secondary={secondary}
        data-identifier={dataIdentifier}
    >
        {children}
    </StyledComponent>
);
Button.defaultProps = defaultProps;

export type ButtonProps = Props;

export default Button;
