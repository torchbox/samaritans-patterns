import React, { ReactNode, ComponentClass, ChangeEvent } from 'react';

import { ReactComponent as TickIcon } from 'assets/svgs/tick.svg';
import { StyledCheckbox, HiddenCheckbox, CheckboxContainer } from './styled';

type Props = {
    checked: boolean;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    children?: ReactNode;
    id: string;
    ariaLabel: string;
    ariaRequired?: boolean;
    labelComponent?:
        | string
        | ComponentClass<{
              'checked': boolean;
              'htmlFor': string;
              'aria-label': string;
          }>;
};

const Checkbox = ({
    checked,
    onChange,
    children,
    id,
    ariaLabel,
    ariaRequired = false,
    labelComponent = 'label',
}: Props) =>
    React.createElement(
        labelComponent,
        { checked, 'htmlFor': id, 'aria-label': ariaLabel },
        <>
            <CheckboxContainer>
                <HiddenCheckbox
                    checked={checked}
                    onChange={onChange}
                    id={id}
                    aria-required={ariaRequired}
                />
                <StyledCheckbox checked={checked} onChange={onChange}>
                    <TickIcon aria-hidden="true" />
                </StyledCheckbox>
            </CheckboxContainer>
            {children}
        </>,
    );

export default Checkbox;
