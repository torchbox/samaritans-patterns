import React, {
    useState,
    useCallback,
    useEffect,
    ReactNode,
    ReactElement,
} from 'react';
import { useTransition, animated, config } from 'react-spring';
import PropTypes from 'prop-types';

import Button from 'components/Button';
import ButtonsWrapper from 'components/ButtonsWrapper/styled';

type TileProps = {
    name: string;
    content: ReactNode;
    nextButtonText: string;
    onNext?: (cb: () => void) => void;
    otherButtons?: ReactNode;
} & typeof defaultProps;

const defaultProps = {
    goBack: false,
    onBack: () => {},
    onClick: () => {},
};

const Tile = ({
    name,
    content,
    nextButtonText,
    onClick,
    onNext,
    goBack,
    onBack,
    otherButtons,
}: TileProps) => {
    const handleClick = () => {
        onNext ? onNext(onClick) : onClick();
    };

    return (
        <div className={name}>
            {content}
            <ButtonsWrapper>
                {goBack && (
                    <Button action={onBack} secondary dataIdentifier="tileBack">
                        Back
                    </Button>
                )}
                <Button action={handleClick} dataIdentifier="tileNext">
                    {nextButtonText}
                </Button>
                {otherButtons}
            </ButtonsWrapper>
        </div>
    );
};
Tile.defaultProps = defaultProps;

export { Tile };

type TileConstructorProps = Omit<TileProps, 'onClick' | 'onBack'>;
interface TilerProps {
    onChange?: (tile: string) => void;
    children: (boolean | ReactElement<TileConstructorProps>)[];
}

const Tiler = ({ children, onChange }: TilerProps) => {
    const filteredChildren = children.filter(
        (child) => child,
    ) as ReactElement<TileProps>[];

    const onClick = () => changeIndex(index + 1);
    const onBack = () => changeIndex(index - 1);

    const [index, set] = useState(0);
    const [firstRun, setFirst] = useState(true);

    const elements = React.Children.map(
        filteredChildren,
        (tile: React.ReactElement<TileProps>) =>
            React.cloneElement(tile, {
                onClick,
                onBack,
            }),
    );

    useEffect(() => {
        if (index === 0 && firstRun) {
            setFirst(false);
            if (onChange) {
                onChange(elements[0].props.name);
            }
        }
    }, [index, firstRun, setFirst, onChange, elements]);

    const changeIndex = useCallback(
        (newIndex) => {
            set(newIndex);
            if (onChange) {
                onChange(filteredChildren[newIndex].props.name);
            }
        },
        [onChange, filteredChildren],
    );

    const transitions = useTransition(index, (tile) => tile, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { display: 'none' },
        config: config.gentle,
    });

    return (
        <>
            {transitions.map(({ item, props, key }) => (
                <animated.div style={props} key={key}>
                    {elements[item]}
                </animated.div>
            ))}
        </>
    );
};

Tiler.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Tiler;
