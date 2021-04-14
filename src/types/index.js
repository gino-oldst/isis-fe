// @flow

// Typography
export type TypographyVariant = 'size-40' | 'size-26' | 'size-24' | 'size-22' | 'size-20' | 'size-18' | 'size-16' | 'size-14' | 'size-12';
export type Color = 'color-1' | 'color-2' | 'color-3';
export type Weight = 'light' | 'regular' | 'semi-bold' | 'bold';

// Button
export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'danger' | 'light' | 'dark' | 'link' |
    'outline-primary' | 'outline-secondary' | 'outline-success' | 'outline-warning' | 'outline-info' | 'outline-danger' | 'outline-light' | 'outline-dark';

// ModalContainer
export type ModalSize = 'sm' | 'md' | 'lg';

// Collapsible sidebar menu
export type Menu = {
    label: string,
    onClick?: Function,
    icon: any,
    subMenu?: Array<{
        key: string,
        label: string,
        onClick?: Function
    }>
}
