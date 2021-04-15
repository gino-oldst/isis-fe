// @flow
import React from 'react';
import Breadcrumbs from './Breadcrumbs';

type Props = {
    links: Array,
    isLoading: Boolean,
    className?: string
}

export default function BreadcrumbsContainer({
    links,
    isLoading,
    className = ''
}: Props): React$Element<any> {
    return (
        <Breadcrumbs isLoading={isLoading} links={links} className={className} />
    );
}
