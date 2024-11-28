import React from "react";
import styles from "./ConfirmationModal.module.css";
import { format } from "date-fns";

const ConfirmationModal = ({ event, onConfirm, onCancel }) => {
  if (!event) {
    return;
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Are you sure you want to delete this event?</h3>
        <p>
          <strong>Event to delete: &nbsp;{event.title}</strong> on
          {format(new Date(event.date), "MMMM dd, yyyy")}
        </p>
        <div className={styles.modalActions}>
          <button
            className={styles.confirmButton}
            onClick={() => onConfirm(event.id)}
          >
            Yes, Delete
          </button>
          <button className={styles.cancelButton} onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
