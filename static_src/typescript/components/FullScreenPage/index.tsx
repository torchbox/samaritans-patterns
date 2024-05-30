import React from 'react';

import StyledFullScreenPage from './styled';

type Props = {
    text: string;
};

const FullScreenPage = ({ text }: Props) => (
    <StyledFullScreenPage>
        <div>{text}</div>
    </StyledFullScreenPage>
);

export default FullScreenPage;
