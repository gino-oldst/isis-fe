// @flow
import React from 'react';
import Button from '../../components/base/Button/Button';
import Typography from '../../components/base/Typography/Typography';
import CollapsibleSidebar from '../../components/base/CollapsibleSidebar/CollapsibleSidebarContainer';
import withLoading from '../../components/modules/withLoading/withLoading';
import type { Menu } from '../../types';
import {
    Row,
    Col,
    Card,
    CardBody,
    Progress
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Line, Doughnut } from 'react-chartjs-2';
import {
    lineChartOptions,
    doughnutChartOptions,
    makeLineChartData,
    makeDougnutChartData
} from '../../utils/charts';
import './dashboard.scss';

type Props = {
    sidebarMenu: Array<Menu>
}

function DashboardScreen({ sidebarMenu }: Props): React$Element<any> {
    return (
        <div className='dashboard'>
            <CollapsibleSidebar
                menu={sidebarMenu} />
            <div className='dashboard__content w-100 overflow-auto'>
                <div className='dashboard__header d-flex align-items-center mb-4'>
                    <Typography color='color-3' className='dashboard__title mr-auto'>MAR Alerts Overview</Typography>
                    <Button label='Download' color='info' size='lg' />
                </div>
                <div>
                    <Row>
                        <Col lg={12} xl={8}>
                            <Card>
                                <CardBody>
                                    <Row className='dashboard__date-ranger pb-3'>
                                        <Col>
                                            <Typography color='color-3' variant='size-20' weight='semi-bold'>Date Range</Typography>
                                        </Col>
                                    </Row>
                                    <Row className='dashboard__received-alerts py-3'>
                                        <Col lg={12} xl={6}>
                                            <Card>
                                                <CardBody className='d-flex align-items-center justify-content-center'>
                                                    <FontAwesomeIcon className='mr-4' icon='bell' size='lg' />
                                                    <Typography className='mr-2' color='color-3' weight='bold'
                                                        variant='size-20'>70</Typography>
                                                    <Typography color='color-3' weight='light' variant='size-16'>Alerts Received</Typography>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                        <Col lg={12} xl={6}>
                                            <Card className='mt-xl-0 mt-3'>
                                                <CardBody className='d-flex align-items-center justify-content-center'>
                                                    <FontAwesomeIcon className='mr-4' icon='bell' size='lg' />
                                                    <Typography className='mr-2' color='color-3' weight='bold'
                                                        variant='size-20'>70</Typography>
                                                    <Typography color='color-3' weight='light' variant='size-16'>Alerts Received</Typography>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <div className='dashboard__alert-statistics py-3'>
                                                <Typography color='color-3' variant='size-24' className='mb-4'>Alert Statistics</Typography>
                                                <div className='dashboard__charts-alert-statistics__chart'>
                                                    <Line
                                                        data={makeLineChartData}
                                                        height={320}
                                                        options={lineChartOptions()} />
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <div className='dashboard__escalation-level py-3'>
                                                <Typography color='color-3' variant='size-24' className='mb-4'>Escalation Level Changes in Period</Typography>
                                                <div className='dashboard__charts-escalation-level__chart'>
                                                    <Doughnut
                                                        data={makeDougnutChartData}
                                                        height={320}
                                                        options={doughnutChartOptions()} />
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg={12} xl={4}>
                            <Card className='mt-xl-0 mt-3 p-3'>
                                <CardBody>
                                    <Row>
                                        <Col>
                                            <div className='dashboard__status-level p-3'>
                                                <Typography color='color-3' variant='size-24' className='mb-4'>Current Status Level Alerts</Typography>
                                                <div className='dashboard__charts-status-level__chart'>
                                                    <Progress multi={true}>
                                                        <Progress bar={true} value='danger' value='25'>Open</Progress>
                                                        <Progress bar={true} color='info' value='20'>In Review</Progress>
                                                        <Progress bar={true} color='success' value='40'>Resolved</Progress>
                                                        <Progress bar={true} color='secondary' value='15'>Done</Progress>
                                                    </Progress>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                            <Card className='mt-4'>
                                <CardBody>
                                    <Row>
                                        <Col>
                                            <div className='dashboard__behaviour-types p-3'>
                                                <Typography color='color-3' variant='size-24' className='mb-4'>Current Behaviour Type</Typography>
                                                <div className='dashboard__charts-behaviour-types__chart'>
                                                    <Row className='d-flex align-items-center'>
                                                        <Col xs={5} className='text-right'>
                                                            <Typography color='color-3' variant='size-16'>Insider Trading</Typography>
                                                        </Col>
                                                        <Col xs={5}>
                                                            <Progress color='info' value='12' />
                                                        </Col>
                                                        <Col xs={2}>
                                                            <Typography color='color-3' variant='size-16'>12</Typography>
                                                        </Col>
                                                    </Row>
                                                    <Row className='d-flex align-items-center'>
                                                        <Col xs={5} className='text-right'>
                                                            <Typography color='color-3' variant='size-16'>Front Running</Typography>
                                                        </Col>
                                                        <Col xs={5}>
                                                            <Progress color='info' value='8' />
                                                        </Col>
                                                        <Col xs={2}>
                                                            <Typography color='color-3' variant='size-16'>8</Typography>
                                                        </Col>
                                                    </Row>
                                                    <Row className='d-flex align-items-center'>
                                                        <Col xs={5} className='text-right'>
                                                            <Typography color='color-3' variant='size-16'>Making the Close</Typography>
                                                        </Col>
                                                        <Col xs={5}>
                                                            <Progress color='info' value='15' />
                                                        </Col>
                                                        <Col xs={2}>
                                                            <Typography color='color-3' variant='size-16'>15</Typography>
                                                        </Col>
                                                    </Row>
                                                    <Row className='d-flex align-items-center'>
                                                        <Col xs={5} className='text-right'>
                                                            <Typography color='color-3' variant='size-16'>Flash Execution / Order</Typography>
                                                        </Col>
                                                        <Col xs={5}>
                                                            <Progress color='info' value='3' />
                                                        </Col>
                                                        <Col xs={2}>
                                                            <Typography color='color-3' variant='size-16'>3</Typography>
                                                        </Col>
                                                    </Row>
                                                    <Row className='d-flex align-items-center'>
                                                        <Col xs={5} className='text-right'>
                                                            <Typography color='color-3' variant='size-16'>Away from the Market</Typography>
                                                        </Col>
                                                        <Col xs={5}>
                                                            <Progress color='info' value='3' />
                                                        </Col>
                                                        <Col xs={2}>
                                                            <Typography color='color-3' variant='size-16'>3</Typography>
                                                        </Col>
                                                    </Row>
                                                    <Row className='d-flex align-items-center'>
                                                        <Col xs={5} className='text-right'>
                                                            <Typography color='color-3' variant='size-16'>High Volume</Typography>
                                                        </Col>
                                                        <Col xs={5}>
                                                            <Progress color='info' value='9' />
                                                        </Col>
                                                        <Col xs={2}>
                                                            <Typography color='color-3' variant='size-16'>9</Typography>
                                                        </Col>
                                                    </Row>
                                                    <Row className='d-flex align-items-center'>
                                                        <Col xs={5} className='text-right'>
                                                            <Typography color='color-3' variant='size-16'>High Order Count</Typography>
                                                        </Col>
                                                        <Col xs={5}>
                                                            <Progress color='info' value='4' />
                                                        </Col>
                                                        <Col xs={2}>
                                                            <Typography color='color-3' variant='size-16'>4</Typography>
                                                        </Col>
                                                    </Row>
                                                    <Row className='d-flex align-items-center'>
                                                        <Col xs={5} className='text-right'>
                                                            <Typography color='color-3' variant='size-16'>Large Order</Typography>
                                                        </Col>
                                                        <Col xs={5}>
                                                            <Progress color='info' value='6' />
                                                        </Col>
                                                        <Col xs={2}>
                                                            <Typography color='color-3' variant='size-16'>6</Typography>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                            <Card className='mt-4'>
                                <CardBody>
                                    <Row>
                                        <Col>
                                            Current Assigned Alerts
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    );
}

const Dashboard: any = withLoading<React$Element<Props>>(DashboardScreen);

export default Dashboard;
