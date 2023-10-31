import React from 'react';
import { Toast } from 'react-bootstrap';

const ToastComponent = ({ showToast, onClose, message, delay, messageType }) => {
    const toastClass = messageType === 'success' ? 'bg-success' : 'bg-danger';
  return (
    <Toast show={showToast} onClose={onClose} delay={delay} autohide>
      <Toast.Body className={toastClass}>  
        {message}
      </Toast.Body>
    </Toast>
  );
};

export default ToastComponent;