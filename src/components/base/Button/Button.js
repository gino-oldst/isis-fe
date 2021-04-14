// @flow
import React from 'react';
import Button from 'react-bootstrap/Button';
import type { ButtonVariant } from '../../../types';
import './button.scss';

type Props = {
    variant?: ButtonVariant,
    label: string,
    className?: string,
    onClick?: Function
}

export default function AppButton({ variant, label, className = '', onClick, ...rest }: Props): React$Element<any> {
    return (
        <Button
            {...rest}
            variant={variant || 'primary'}
            className={className}
            onClick={onClick || null}>
            {label}
        </Button>
    );
}
