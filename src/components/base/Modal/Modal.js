// @flow
import * as React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from '../Button/Button';
import './modal.scss';

type Props = {
    className?: string,
    title?: string,
    children?: string | React.Node,
    onToggle: Function,
    isDemo?: boolean,
    isShow: boolean,
    footer?: string | React.Node
}

export default function AppModal({ className = '', title, children, onToggle, footer, isDemo, isShow }: Props): React$Element<any> {
    const [show, setShow] = React.useState(isShow);

    const handleClose = () => {
        onToggle && onToggle();

        setShow(!show);
    };

    return (
        <React.Fragment>
            {isDemo && <Button label='Show modal' onClick={handleClose}/>}

            <Modal show={isDemo ? show : isShow} centered={true} onHide={handleClose}>
                {title && (
                    <Modal.Header closeButton={true}>
                        <Modal.Title>{title}</Modal.Title>
                    </Modal.Header>
                )}

                <Modal.Body>
                    {children}
                </Modal.Body>

                {footer && (
                    <Modal.Footer>
                        {footer}
                    </Modal.Footer>
                )}
            </Modal>
        </React.Fragment>
    );
}
