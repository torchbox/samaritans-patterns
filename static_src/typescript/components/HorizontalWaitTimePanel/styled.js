import styled from 'styled-components';

export const Panel = styled.div`
    display: flex;
    flex-direction: row;
    padding: 20px 12px 4px 12px;
    background-color: rgba(255, 255, 255, 0.15);
    border-radius: 10px;
    overflow: hidden;
    width: 100%;
    margin-bottom: ${(props) => props.theme.grid.baseGrid};
`;

export const Content = styled.div`
    display: flex;
    flex-direction: column;
    color: ${(props) => props.theme.colors.white};
    text-align: left;
    justify-content: center;
    flex: 1;
    padding: 0 0 12px;
    margin-left: 12px;

    > p {
        margin: 0;
    }
`;

export const Copy = styled.p`
    color: ${(props) => props.theme.colors.white};
    margin-bottom: 0.5rem;
    font-size: ${(props) => props.theme.fonts.m};
`;

export const WaitTime = styled.div`
    color: ${(props) => props.theme.colors.white};
    margin: 0;
    font-weight: ${(props) => props.theme.fonts.bold};
    font-size: 30px;
`;
