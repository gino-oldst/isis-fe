// @flow
import React from 'react';
import {
    UncontrolledButtonDropdown,
    DropdownToggle,
    DropdownMenu
} from 'reactstrap';
import './custom-dropdown.scss';

type Props = {
    toggleClassName?: string,
    tag?: string,
    children: any,
    toggle: any,
    parentClassName: string,
    direction?: string,
};

export default function CustomDropdown({
    tag,
    toggleClassName,
    variant,
    toggle,
    direction,
    hasCaret,
    children,
    parentClassName = '',
    isDangerousHTML = false,
    className = '',
    ...rest
}: Props): React$Element<any> {
    return (
        <UncontrolledButtonDropdown
            direction={direction}
            className={parentClassName}>
            <DropdownToggle tag={tag || null} className={toggleClassName || ''}>
                {isDangerousHTML
                    ? (
                        <span dangerouslySetInnerHTML={{ __html: toggle }} />
                    )
                    : (
                        toggle
                    )}
                {hasCaret && <i className='fa fa-caret-down ml-3' />}
            </DropdownToggle>

            <DropdownMenu>{children}</DropdownMenu>
        </UncontrolledButtonDropdown>
    );
}
