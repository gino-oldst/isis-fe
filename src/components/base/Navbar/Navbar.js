// @flow
import * as React from 'react';
import {
    Nav,
    Navbar as ReactNavbar,
    NavbarBrand
} from 'reactstrap';
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
        <div className={`${className}`}>
            <ReactNavbar color='light' light={true}>
                <NavbarBrand href='/dashboard'>
                    <img src={navbarBrand} alt='mariana_logo' className='navbar__brand-logo mr-auto' />
                </NavbarBrand>
                <Nav className='ml-auto' navbar={true}>
                    {children}
                </Nav>
            </ReactNavbar>
        </div>
    );
}
