import React from 'react';
import Modal from 'react-bootstrap/Modal';

function AlertModal(props) {
    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered

        >
            <Modal.Header closeButton style={{backgroundColor:'#f8d7da'}}>
                <Modal.Title id="contained-modal-title-vcenter" style={{color:'#7d2b33'}}>
                    Warning
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{backgroundColor:'#f8d7da'}}>
                <p style={{color:'#7d2b33'}}>
                    {props.message}
                </p>
            </Modal.Body>
        </Modal>
    );
}

export default AlertModal;
