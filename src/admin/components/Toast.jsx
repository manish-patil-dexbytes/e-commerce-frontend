import React from 'react';
import { Toast } from 'react-bootstrap';

// ToastComponent functional component
const ToastComponent = ({ showToast, onClose, message, delay, messageType }) => {
    // Determine the CSS class based on messageType (success or error)
    const toastClass = messageType === 'success' ? 'bg-success' : 'bg-danger';

    return (
        // Toast component from react-bootstrap
        <Toast show={showToast} onClose={onClose} delay={delay} autohide>
            <Toast.Body className={toastClass}>
                {message} {/* Display the message inside the toast body */}
            </Toast.Body>
        </Toast>
    );
};

export default ToastComponent; // Export the ToastComponent
