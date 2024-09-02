import Swal, { SweetAlertIcon } from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

interface ShowAlertProps {
  title?: string;
  text?: string;
  icon?: SweetAlertIcon;
  confirmButtonText?: string;
  cancelButtonText?: string;
  showCancel?: boolean;
  onAfterClose?: () => void;
  customFunction: () => void;
}

export const showAlert = ({
  title = 'Default Title',
  text = 'Default Text',
  icon = 'info',
  confirmButtonText = 'Confirm',
  cancelButtonText = 'Cancel',
  showCancel = false,
  onAfterClose,
  customFunction
}: ShowAlertProps) => {
  MySwal.fire({
    title,
    text,
    icon,
    showCancelButton: showCancel,
    confirmButtonText,
    cancelButtonText,
    preConfirm: () => {
      return new Promise((resolve) => {
        customFunction();
        resolve(null);
      });
    },
    customClass: {
      title: 'swal-title',
      htmlContainer: 'swal-text',
      confirmButton: 'swal-confirm-button',
      cancelButton: 'swal-cancel-button'
    },
    didClose: () => {
      if (onAfterClose) {
        onAfterClose();
      }
    },
  });
};
