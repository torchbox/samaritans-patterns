import React from 'react';

import { ReactComponent as InfoIcon } from 'assets/svgs/info.svg';
import StyledSafeguardingBanner, { StyledHeading, StyledLink } from './styled';

function prettifyUrl(link: string) {
    if (!link) {
        return '';
    }
    const url = new URL(link);
    const urlWithoutProtocol = url.href.slice(url.protocol.length + 2);
    return urlWithoutProtocol.endsWith('/')
        ? urlWithoutProtocol.slice(0, -1)
        : urlWithoutProtocol;
}

type Props = {
    title: string;
    text: string;
    link_text: string;
    link_url: string;
};

const SafeguardingBanner = ({ title, text, link_text, link_url }: Props) => (
    <StyledSafeguardingBanner>
        <InfoIcon />
        <div>
            {title && <StyledHeading>{title}</StyledHeading>}
            {text &&
                text.split('\n').map((value) => <p key={value}>{value}</p>)}
            {link_url && (
                <StyledLink href={link_url}>
                    {link_text || prettifyUrl(link_url)}
                </StyledLink>
            )}
        </div>
    </StyledSafeguardingBanner>
);

export default SafeguardingBanner;
