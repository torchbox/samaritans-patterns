import React from 'react';
import RemovedFromQueue from '../RemovedFromQueue';

export default {
    component: RemovedFromQueue,
    title: 'Removed from queue',
};

export const techProblems = () => <RemovedFromQueue />;

export const volunteerExit = () => <RemovedFromQueue volunteerExit={true} />;
