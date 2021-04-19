// @flow
import React from 'react';
import './tooltip.scss';
import ReactTooltip from 'react-tooltip';

type Props = {
    className?: string,
    children?: string | React.Node
}

export default function Tooltip({
    className = '',
    children,
    ...rest
}: Props): React$Element<any> {
    return (
        <ReactTooltip effect='solid' id='tooltip'
            type='light' border={true} borderColor='#dee2e6'
            arrowColor='white' className={`tooltip text-center ${className}`} {...rest}>
            {children}
        </ReactTooltip>
    );
}
