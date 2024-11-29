import { useState } from "react";
import Calendar from "../components/Calendar";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [events, setEvents] = useState([]);

  const addEvent = (event) => {
    setEvents((prevEvents) => [...prevEvents, event]);
  };

  const editEvent = (updatedEvent) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
  };

  const deleteEvent = (eventId) => {
    setEvents((prevEvents) =>
      prevEvents.filter((event) => event.id !== eventId)
    );
  };

  return (
    <>
      <header>
        <h1 className={styles.title}>Event Scheduler</h1>
      </header>
      <Calendar
        events={events}
        onEventAdd={addEvent}
        onEventEdit={editEvent}
        onEventDelete={deleteEvent}
      />
    </>
  );
}
