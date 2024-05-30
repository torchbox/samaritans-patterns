import React from 'react';

import { StyledVersion } from './styled';

type Props = typeof defaultProps;

const defaultProps = {
    isHidden: false,
};

const Version = ({ isHidden }: Props) => (
    <StyledVersion isHidden={isHidden}>Version: PLACEHOLDER</StyledVersion>
);

Version.defaultProps = defaultProps;

export default Version;
