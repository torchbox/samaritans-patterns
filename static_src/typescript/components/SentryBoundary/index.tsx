import React, { Component } from 'react';
import * as Sentry from '@sentry/react';
import LinkButton from 'components/LinkButton';

import StyledSentryBoundary from './styled';

type Props = {
    children: React.ReactNode;
};

const SentryBoundary = ({ children }: Props) => (
    <Sentry.ErrorBoundary
        fallback={
            <StyledSentryBoundary>
                <h1 hidden>Error</h1>
                <h2>
                    We&apos;re sorry - something has
                    <br /> gone wrong.
                </h2>
                <p>Our team has been notified.</p>
                <p>
                    We understand this is frustrating and we’re doing everything
                    we can to fix the problem.
                </p>
                <p>
                    You can call us free any time on{' '}
                    <a
                        aria-label="Samaritans phone number 116 123"
                        href="tel:116123"
                    >
                        116 123
                    </a>
                    .
                </p>
                <LinkButton href="https://www.samaritans.org/how-we-can-help/contact-samaritan/">
                    Find another service
                </LinkButton>
            </StyledSentryBoundary>
        }
    >
        {children}
    </Sentry.ErrorBoundary>
);

export default SentryBoundary;
