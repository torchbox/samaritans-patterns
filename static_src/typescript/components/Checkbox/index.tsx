import React, { ReactNode, ComponentClass, ChangeEvent } from 'react';

import { ReactComponent as TickIcon } from 'assets/svgs/tick.svg';
import { StyledCheckbox, HiddenCheckbox, CheckboxContainer } from './styled';

type Props = {
    checked: boolean;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    children?: ReactNode;
    id: string;
    ariaLabel: string;
} & typeof defaultProps;

const defaultProps = {
    labelComponent: 'label' as
        | string
        | ComponentClass<{
              'checked': boolean;
              'htmlFor': string;
              'aria-label': string;
          }>,
};

const Checkbox = ({
    checked,
    onChange,
    children,
    labelComponent,
    id,
    ariaLabel,
}: Props) =>
    React.createElement(
        labelComponent,
        { checked, 'htmlFor': id, 'aria-label': ariaLabel },
        <>
            <CheckboxContainer>
                <HiddenCheckbox checked={checked} onChange={onChange} id={id} />
                <StyledCheckbox checked={checked} onChange={onChange}>
                    <TickIcon aria-hidden="true" />
                </StyledCheckbox>
            </CheckboxContainer>
            {children}
        </>,
    );

Checkbox.defaultProps = defaultProps;

export default Checkbox;
