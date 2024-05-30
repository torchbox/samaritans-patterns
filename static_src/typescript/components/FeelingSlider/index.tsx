import React from 'react';
import Slider, { Handle } from 'rc-slider';
import Tooltip from 'rc-tooltip';

import StyledFeelingsSlider, { StyledFeelingsSliderBookends } from './styled';

// rc-slider 9 doesnt have typing
const handle = (props: any) => {
    const { value, dragging, index, ...restProps } = props;
    return (
        <Tooltip
            key={index}
            visible
            overlay={() => <span data-hj-suppress>{value}</span>}
            placement="top"
            prefixCls="rc-slider-tooltip"
        >
            <Handle value={value} {...restProps} />
        </Tooltip>
    );
};

type Props = {
    updateFeeling: (score: number) => void;
    ariaLabel: string;
};

const FeelingSlider = ({ updateFeeling, ariaLabel }: Props) => {
    const marks = {
        0: '0',
        1: '',
        2: '',
        3: '',
        4: '',
        5: '5',
        6: '',
        7: '',
        8: '',
        9: '',
        10: '10',
    };

    return (
        <StyledFeelingsSlider>
            <label
                data-hj-suppress
                aria-live="polite"
                aria-label={`${ariaLabel} Choose a number between 0 and 10. 0 meaning not distressed and 10 meaning severly distressed.`}
            >
                <Slider
                    min={0}
                    max={10}
                    defaultValue={0}
                    marks={marks}
                    handle={handle}
                    onChange={updateFeeling}
                />
            </label>
            <StyledFeelingsSliderBookends aria-hidden="true">
                <p>
                    Not
                    <br />
                    Distressed
                </p>
                <p>
                    Severely
                    <br />
                    Distressed
                </p>
            </StyledFeelingsSliderBookends>
        </StyledFeelingsSlider>
    );
};

export default FeelingSlider;
