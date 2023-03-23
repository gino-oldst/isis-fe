// @flow
import React from 'react';
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
import { Accordion, Card } from 'react-bootstrap';
import { IoMdMenu, IoMdClose } from 'react-icons/io';
import { MdKeyboardArrowDown } from 'react-icons/md';
import Typography from '../Typography/Typography';
import type { Menu } from '../../../types';
import './collapsible-sidebar.scss';
import moment from 'moment';
import { config } from '../../../config/constants';

type Props = {
    className?: string,
    children?: any,
    handleToggleSidebar: Function,
    isOpen: boolean,
    pathName: string,
    menu?: Array<Menu>
};

export default function CollapsibleSidebar({
    className = '', children, handleToggleSidebar, isOpen, pathName, menu = []
}: Props): React$Element<any> {
    const Icon = !isOpen ? IoMdMenu : IoMdClose;

    return (
        <div className={`collapsible-sidebar${!isOpen ? ' is-open' : ''}`} >
            <div className='collapsible-sidebar__control'>
                <div onClick={handleToggleSidebar} className='collapsible-sidebar__control-button'>
                    <Icon color='#fff' size={30} className='m-3'/>
                </div>
            </div>
            <div className={`collapsible-sidebar__content${!isOpen ? ' is-visible' : ''}  ${className}`}>
                <div className='collapsible-sidebar__content-menu'>
                    {menu.map((item, i) =>
                        <Accordion key={i}>
                            <Card>
                                <Card.Header>
                                    <div onClick={item.onClick || null}>
                                        <CustomToggle eventKey={i} pathName={pathName} itemKey={item.key}
                                            withSubmenu={!!item.subMenu}>
                                            <Typography variant='size-16' className='ml-3 mb-0'>{item.label}</Typography>
                                        </CustomToggle>
                                    </div>
                                </Card.Header>
                                {item.subMenu && (
                                    <Accordion.Collapse eventKey={i}>
                                        <div>
                                            {item.subMenu.map(sub =>
                                                <div
                                                    key={sub.key}
                                                    onClick={item.onClick || null}
                                                    className={`collapsible-sidebar__menu-item ${pathName.includes(sub.key.toLowerCase()) ? 'is-active' : ''}`}>
                                                    <p className='ml-3 mb-0'>{sub.label}</p>
                                                </div>
                                            )}
                                        </div>
                                    </Accordion.Collapse>
                                )}
                            </Card>
                        </Accordion>
                    )}
                </div>
                {children}
            </div>
            <div className={`mt-3 collapsible-sidebar__content${!isOpen ? ' is-visible' : ''}`}>
                <div className={'collapsible-sidebar__menu-footer'}>
                    <div>
                        <Typography variant='size-13' className='ml-3 mb-0'>Messages in Database</Typography>
                        <Typography variant='size-13' weight='bold' className='ml-3 mb-0'>{moment(new Date()).subtract(3, 'months').format('MMM YYYY')} to {moment(new Date()).format('MMM YYYY')}</Typography>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CustomToggle({ children, eventKey, pathName, itemKey, withSubmenu }) {
    const decoratedOnClick = useAccordionToggle(eventKey);

    return (
        <div
            className={`collapsible-sidebar__menu-item justify-content-between ${pathName.includes(itemKey.toLowerCase()) ? 'is-active' : ''}`}
            onClick={decoratedOnClick}>
            <div className='d-flex'>
                {children}
            </div>
            {withSubmenu && <MdKeyboardArrowDown size={18}/> }
        </div>
    );
}
