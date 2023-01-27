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
    onClick?: Function,
    iconLeft?: any,
    iconRight?: any,
    title?: string
}

export default function AppButton({ title, iconLeft: IconLeft, iconRight: IconRight, variant, label, className = '', isLoading = false, onClick, ...rest }: Props): React$Element<any> {
    return (
        <Button
            title={title}
            {...rest}
            variant={variant || 'primary'}
            className={className}
            onClick={onClick || null}>
            {isLoading && <Spinner size='sm' className='mr-2' style={{ marginBottom: '2px' }} />}
            {IconLeft && (
                <IconLeft className='mr-2'/>
            )}
            {label}
            {IconRight && (
                <IconRight className='ml-2'/>
            )}
        </Button>
    );
}
