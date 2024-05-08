import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { ReactNode } from "react";

interface ConfirmationDialogProps {
    title: string;
    onSave?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onCancel?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    isOpen: boolean;
    disableSave?: boolean;
    children: ReactNode;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
    title,
    onCancel,
    onSave,
    isOpen,
    disableSave,
    children,
}) => {
    return (
        <Dialog
            open={isOpen}
            maxWidth="sm"
            onClose={onCancel}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>{children}</DialogContent>
            <DialogActions>
                <Button onClick={onSave} disabled={disableSave}>
                    Save
                </Button>
                <Button onClick={onCancel} autoFocus>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};
