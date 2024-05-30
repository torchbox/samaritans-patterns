import React from 'react';
import { audioNotification } from '../../notifications';

import ButtonLink from './styled';

const TestSound = () => (
    <ButtonLink onClick={() => audioNotification.play()}>Test sound</ButtonLink>
);

export default TestSound;
