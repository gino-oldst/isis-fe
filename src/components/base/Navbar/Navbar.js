// @flow
import * as React from 'react';
import Typography from '../Typography/Typography';
import './navbar.scss';

type Props = {
    className?: string,
    navbarBrand?: string,
    children?: any,
}

// NOTE: this is just a sample nav
// please update when needed

export default function Navbar({
    className = '',
    navbarBrand,
    children
}: Props): React$Element<any> {
    return (
        <div className={`navbar ${className}`} >
            <Typography variant='size-24' className='mr-auto'>{navbarBrand}</Typography>
            {children}
        </div>
    );
}
