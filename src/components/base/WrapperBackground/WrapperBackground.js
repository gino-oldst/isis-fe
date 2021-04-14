// @flow
import React from 'react';
import './wrapper-background.scss';

type Props = {
    children: any,
    className?: string
}

export default function WrapperBackground({ children, className = '' }: Props): React$Element<"div"> {
    return (
        <div className={`wrapper-background ${className}`} >
            {children}
        </div>
    );
}
