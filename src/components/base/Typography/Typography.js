// @flow
import React from 'react';
import type { TypographyVariant, Color, Weight } from '../../../types';
import './typography.scss';

type Props = {
    className?: string,
    component?: string,
    children: any,
    color?: Color,
    variant?: TypographyVariant,
    weight?: Weight,
    props?: any
}

export default function Typography({
    component,
    className = '',
    color = 'color-2',
    variant = 'size-16',
    weight = 'regular',
    children,
    ...props
}: Props): React$Element<any> {
    const Component = component ? 'span' : 'p';

    return (
        <Component {...props} className={`typography ${variant} ${color} weight-${weight} ${className}`} >
            {children}
        </Component>
    );
}
