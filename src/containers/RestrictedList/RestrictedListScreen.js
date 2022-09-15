// @flow
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Table from '../../components/base/Table/Table';
import Typography from '../../components/base/Typography/Typography';
import Breadcrumbs from '../../components/base/Breadcrumbs/Breadcrumbs';
import CollapsibleSidebar from '../../components/base/CollapsibleSidebar/CollapsibleSidebarContainer';
import withLoading from '../../components/modules/withLoading/withLoading';
import type { Menu } from '../../types';
import {
    Card,
    CardBody
} from 'reactstrap';
import './restricted-list.scss';

import { setLoading } from '../../redux/modules/restrictedList';

type Props = {
    loading: Boolean,
    userId: String,
    breadcrumb: Array,
    loadAlerts: Function,
    tableColumns: Array,
    tableData: Array,
    viewAlertDetails: Function,
    assignees: Array,
    isRowsSelected: Boolean,
    selectedRows: Array,
    sidebarMenu: Array<Menu>,
    handleCloseModal: Function,
    handleDownloadAlertsList: Function,
    loadRestrictedList: Function
}

function RestrictedListScreen({
    loading,
    userId,
    breadcrumb,
    loadAlerts,
    tableColumns,
    tableData,
    viewAlertDetails,
    assignees,
    isRowsSelected,
    selectedRows,
    sidebarMenu,
    handleCloseModal,
    handleDownloadAlertsList,
    loadRestrictedList
}: Props): React$Element<any> {
    const dispatch = useDispatch();
    const { pageSize, activePage, appliedFilters, sort } = useSelector(({ table }) => table);
    const { table } = useSelector(({ restrictedList }) => restrictedList);

    useEffect(() => {
        dispatch(setLoading());

        loadRestrictedList(
            activePage,
            pageSize,
            appliedFilters,
            sort
        );
    }, [pageSize, activePage, appliedFilters, sort]);

    return (
        <div className='restricted-list'>
            <CollapsibleSidebar
                menu={sidebarMenu} />
            <div className='w-100 overflow-auto'>
                <Breadcrumbs links={breadcrumb} />
                <div className='restricted-list__content'>
                    <Card className='px-4 py-2'>
                        <CardBody>
                            <div className='restricted-list__header d-flex align-items-center'>
                                <Typography color='color-3' className='restricted-list__title mr-auto'>Restricted List</Typography>
                            </div>
                            <Table className='restricted-list__table'
                                loading={loading}
                                tableData={tableData}
                                tableColumns={tableColumns}
                                tablePagination={table.totalPages}
                                totalNoOfRecords={table.totalNoOfRecords}
                                activePage={activePage}
                                selectableRows={false}
                                globalFilter={false}
                                   pagination={true}
                                fetching={table.loading}
                                sortable={true} />
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}

const RestrictedList: any = withLoading<React$Element<Props>>(RestrictedListScreen);

export default RestrictedList;
