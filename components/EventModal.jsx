import { useState, useEffect } from "react";
import { format } from "date-fns";
import styles from "./EventModal.module.css";

const EventModal = ({ selectedDate, onSave, onClose, event }) => {
  // State hooks to manage form data for the event
  const [title, setTitle] = useState(""); // Event title
  const [description, setDescription] = useState(""); // Event description
  const [date, setDate] = useState(
    selectedDate ? format(selectedDate, "yyyy-MM-dd") : "" 
  );

  const today = format(new Date(), "yyyy-MM-dd");

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description);
      setDate(format(new Date(event.date), "yyyy-MM-dd"));
    } else if (selectedDate) {
      setDate(format(selectedDate, "yyyy-MM-dd"));
    }
  }, [event, selectedDate]);

  const handleSubmit = () => {
    // Prevent creating events for past dates
    if (date && new Date(date) < new Date(today)) {
      alert("Cannot create events for past dates!");
      return;
    }

    // Create or update event object
    const newEvent = {
      title,
      description,
      date: date ? new Date(date) : null,
      id: event ? event.id : Date.now(),
    };

    // Validate title is provided
    if (!title) {
      alert("Title is Empty");
      return;
    }
    onSave(newEvent);
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        {/* Modal header displaying either "Add Event" or "Edit Event" */}
        <h3 className={styles.title}>{event ? "Edit Event" : "Add Event"}</h3>

        <label className={styles.label}>Title:</label>
        <input
          className={styles.input}
          type='text'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label className={styles.label}>Description:</label>
        <textarea
          className={styles.textarea}
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
        />

        <label className={styles.label}>Date:</label>
        <input
          className={styles.input}
          type='date'
          value={date}
          onChange={(e) => setDate(e.target.value)}
          min={today} // Disable past dates in the date picker
        />

        <button className={styles.button} onClick={handleSubmit}>
          {event ? "Save Changes" : "Add Event"}
        </button>

        <button className={styles.deleteButton} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default EventModal;
