import React, { useCallback, useEffect, useState } from 'react';

import Spinner from 'components/Spinner';

import StyledLoadingWebchat from './styled';

const LoadingWebchat = () => (
    <StyledLoadingWebchat>
        <div>
            <Spinner />
        </div>
    </StyledLoadingWebchat>
);

export default LoadingWebchat;
