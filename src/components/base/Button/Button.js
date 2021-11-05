// @flow
import React from 'react';
import Button from 'react-bootstrap/Button';
import type { ButtonVariant } from '../../../types';
import { Spinner } from 'reactstrap';
import './button.scss';

type Props = {
    variant?: ButtonVariant,
    label: string,
    className?: string,
    isLoading?: boolean,
    onClick?: Function
}

export default function AppButton({ variant, label, className = '', isLoading = false, onClick, ...rest }: Props): React$Element<any> {
    return (
        <Button
            {...rest}
            variant={variant || 'primary'}
            className={className}
            onClick={onClick || null}>
            {isLoading && <Spinner size='sm' className='mr-2' style={{ marginBottom: '2px' }} />} {label}
        </Button>
    );
}
