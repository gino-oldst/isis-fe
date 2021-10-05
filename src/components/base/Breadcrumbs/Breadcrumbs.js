// @flow
import React from 'react';
import { useHistory } from 'react-router-dom';
import './breadcrumbs.scss';
import { Spinner, Breadcrumb, BreadcrumbItem } from 'reactstrap';

type Props = {
    links: Array,
    isLoading: Boolean,
    className?: string
}

export default function Breadcrumbs({
    links = [],
    isLoading = false,
    className = ''
}: Props): React$Element<any> {
    const history = useHistory();

    return (
        <div className={`breadcrumbs ${className}`} >
            <Breadcrumb className='w-100'>
                {isLoading
                    ? (
                        <Spinner size='sm' color='secondary' className='m-2'/>
                    )
                    : (
                        links.map((link, idx) => {
                            return <BreadcrumbItem key={idx} active={links.length === idx + 1}><a href='#' onClick={() => history.push(`${link.path}`)}>{link.label}</a></BreadcrumbItem>;
                        })
                    )}
            </Breadcrumb>
        </div>
    );
}
