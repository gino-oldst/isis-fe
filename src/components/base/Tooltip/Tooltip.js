// @flow
import React from 'react';
import './tooltip.scss';
import ReactTooltip from 'react-tooltip';
import Typography from '../Typography/Typography';

type Props = {
    className?: string,
    data: Object
}

export default function Tooltip({
    className = '',
    data,
    ...rest
}: Props): React$Element<any> {
    return (
        <ReactTooltip place='bottom' effect='solid' id='tooltip'
            type='light' border={true} borderColor='#dee2e6'
            arrowColor='white' className={`tooltip text-center ${className}`} {...rest}>
            <Typography variant='size-14' weight='semi-bold' color='color-3'>{data.label}</Typography>
            <Typography variant='size-10' weight='light' color='color-3'>{data.alerts} Alerts</Typography>
        </ReactTooltip>
    );
}
