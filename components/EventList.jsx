import { useState } from "react";
import EventModal from "./EventModal";

const EventList = ({ events, onEventAdd, onEventDelete, selectedDate }) => {
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [editingEvent, setEditingEvent] = useState(null); // State to manage the event being edited

  // Handle adding a new event
  const handleAddEvent = (event) => {
    onEventAdd(event);
    setShowModal(false); // Close modal after adding event
  };

  // Handle editing an existing event
  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setShowModal(true); // Open modal for editing
  };

  // Handle deleting an event
  const handleDeleteEvent = (eventId) => {
    onEventDelete(eventId);
  };

  return (
    <div>
      <h3>
        Events on {selectedDate ? selectedDate.toDateString() : "Select a day"}
      </h3>
      <button onClick={() => setShowModal(true)}>Add Event</button>
      {events.map((event) => (
        <div key={event.id} className='event'>
          <span>{event.title}</span>
          <button onClick={() => handleEditEvent(event)}>Edit</button>
          <button onClick={() => handleDeleteEvent(event.id)}>Delete</button>
        </div>
      ))}
      {showModal && (
        <EventModal
          event={editingEvent}
          onSave={handleAddEvent} // Save new or edited event
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default EventList;
