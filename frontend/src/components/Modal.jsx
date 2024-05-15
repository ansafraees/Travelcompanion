import React from 'react';
import {Dialog,DialogContent,Paper,Container} from '@mui/material';

const Modal = ({ children, onClose }) => {
    return (
        <Dialog 
            open={true} 
            onClose={onClose} 
            aria-labelledby="modal-dialog"
            PaperComponent={Paper}
            PaperProps={{ 
                elevation: 1, 
                sx: { 
                    maxWidth: '140vh', 
                    maxHeight: '95vh', 
                    overflow: 'auto' 
                } 
            }}
        >
            <Container maxWidth="md">
                <DialogContent>
                    {children}
                </DialogContent>
            </Container>
        </Dialog>
    );
};

export default Modal;