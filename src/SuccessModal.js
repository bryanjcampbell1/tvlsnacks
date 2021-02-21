import React from 'react';
import Modal from 'react-bootstrap/Modal';

function SuccessModal(props) {
    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered

        >
            <Modal.Header closeButton style={{backgroundColor:'rgb(212,237,218)'}}>
                <Modal.Title id="contained-modal-title-vcenter" style={{color:'rgb(31,95,45)'}}>
                    Success
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{backgroundColor:'rgb(212,237,218)'}}>
                <p style={{color:'rgb(31,95,45)'}}>
                    {props.message}
                </p>
            </Modal.Body>
        </Modal>
    );
}

export default SuccessModal;
