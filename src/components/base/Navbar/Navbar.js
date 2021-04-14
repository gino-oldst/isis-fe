// @flow
import React from 'react';
import Typography from '../Typography/Typography';
import './navbar.scss';

type Props = {
    className?: string
}

const appName = process.env.REACT_APP_SITE_TITLE;

// NOTE: this is just a sample nav
// please update when needed

export default function Navbar({ className = '' }: Props): React$Element<any> {
    return (
        <div className={`navbar ${className}`} >
            <Typography variant='size-24'>{appName}</Typography>
        </div>
    );
}
