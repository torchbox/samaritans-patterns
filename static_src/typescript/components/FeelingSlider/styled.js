import styled from 'styled-components';
import device from 'styles/device';

const StyledFeelingsSlider = styled.div`
    margin: 4rem 1rem 1rem;

    @media ${device.tabletLandscape} {
        margin: 5rem 3rem 1rem;
    }

    /* RC Slider overrides */
    .rc-slider {
        height: 24px;
        counter-reset: dotCounter -1;

        /* individual dots */
        &-dot {
            border: none;
            counter-increment: dotCounter;

            /* surrounding border */
            &::after {
                content: '';
                border: 1px solid ${(props) => props.theme.colors.primary};
                height: 30px;
                width: 30px;
                position: absolute;
                top: -3.1rem;
                left: 50%;
                transform: translate(-50%);
                border-radius: 50%;
                opacity: 0;
                transition: opacity
                    ${(props) => props.theme.transitions.quickTransition};
            }

            /* individual numbers */
            &::before {
                content: counter(dotCounter);
                font-weight: ${(props) => props.theme.fonts.bold};
                color: ${(props) => props.theme.colors.primary};
                font-size: 1rem;
                position: absolute;
                top: -2.9rem;
                opacity: 0;
                transition: opacity
                    ${(props) => props.theme.transitions.quickTransition};
                right: 0;
            }

            ${(props) => props.theme.hover} {
                &::after,
                &::before {
                    opacity: 1;
                }
            }

            /* don't show 0,5,10 on hover as they are already visible */
            &:first-child,
            &:nth-child(6),
            &:last-child {
                ${(props) => props.theme.hover} {
                    &::before {
                        opacity: 0;
                    }
                }
            }
        }

        /* backround rail */
        &-rail {
            background-color: ${(props) => props.theme.colors.secondary};
            height: 15px;

            &::before,
            &::after {
                background-color: ${(props) => props.theme.colors.secondary};
                content: '';
                width: 15px;
                height: 15px;
                display: block;
                position: absolute;
            }

            &::after {
                border-top-left-radius: 50%;
                border-bottom-left-radius: 50%;
                left: -10px;
            }

            &::before {
                border-top-right-radius: 50%;
                border-bottom-right-radius: 50%;
                right: -10px;
            }
        }

        /* marks bar */
        &-mark {
            top: -2.4rem;

            &-text {
                font-weight: ${(props) => props.theme.fonts.bold};
                color: ${(props) => props.theme.colors.primary};
                font-size: 1rem;
                // width: 46px !important;
            }
        }

        &-step {
            height: 9px;
        }

        /* circular handle */
        &-handle {
            height: 25px;
            width: 25px;
            background-color: ${(props) => props.theme.colors.primary};
            border: none;
            margin-left: -13px;

            &:focus {
                box-shadow: 0 0 0 5px ${(props) => props.theme.colors.tertiary};
            }
        }

        /* progressive bar that follows the handle */
        &-track {
            display: none;
        }
    }
`;

export const StyledFeelingsSliderBookends = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;

    p {
        color: ${(props) => props.theme.colors.primary};
        font-weight: ${(props) => props.theme.fonts.bold};

        &:first-child {
            text-align: left;
            margin-left: -0.5rem;

            @media ${device.tabletLandscape} {
                margin-left: -2rem;
            }
        }

        &:last-child {
            text-align: right;
            margin-right: -0.5rem;

            @media ${device.tabletLandscape} {
                margin-right: -2rem;
            }
        }
    }
`;

export default StyledFeelingsSlider;
