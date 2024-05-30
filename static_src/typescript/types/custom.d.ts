declare module '*.svg' {
    import React = require('react');

    export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
    export default ReactComponent;
}

declare module 'react-dock' {
    import * as React from 'react';

    type DockStyle = {
        visibility: string;
    };

    type DockProps = {
        position?: 'left' | 'right' | 'top' | 'bottom';
        isVisible?: boolean;
        dimMode: 'none' | 'transparent' | 'opaque';
        fluid?: boolean;
        size?: number;
        zIndex?: number;
        dockStyle?: DockStyle;
    };

    class Dock extends React.Component<DockProps> {}

    export default Dock;
}

interface Window {
    ChatBotUiLoader: any;
}
