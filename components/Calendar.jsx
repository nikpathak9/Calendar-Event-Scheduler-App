import React, { useReducer, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isBefore,
  isToday,
} from "date-fns";
import EventModal from "./EventModal";
import ConfirmationModal from "./ConfirmationModal";
import styles from "./Calendar.module.css";

// Reducer function to manage the calendar state
const calendarReducer = (state, action) => {
  switch (action.type) {
    case "SET_CURRENT_MONTH":
      return { ...state, currentMonth: action.payload };
    case "SET_SELECTED_DATE":
      return { ...state, selectedDate: action.payload };
    case "SET_EVENT_LIST":
      return { ...state, eventList: action.payload };
    case "SET_EDITING_EVENT":
      return { ...state, editingEvent: action.payload };
    case "SET_MODAL_OPEN":
      return { ...state, isModalOpen: action.payload };
    case "SET_IS_TRANSITIONING":
      return { ...state, isTransitioning: action.payload };
    case "SET_DIRECTION":
      return { ...state, direction: action.payload };
    case "SET_DELETE_MODAL_OPEN":
      return { ...state, isDeleteModalOpen: action.payload };
    case "SET_EVENT_TO_DELETE":
      return { ...state, eventToDelete: action.payload };
    default:
      return state;
  }
};

const Calendar = ({ events, onEventAdd, onEventEdit, onEventDelete }) => {
  // Initialize state using the reducer
  const [state, dispatch] = useReducer(calendarReducer, {
    currentMonth: new Date(),
    selectedDate: null,
    isModalOpen: false,
    editingEvent: null,
    eventList: events,
    isTransitioning: false,
    direction: "",
    isDeleteModalOpen: false,
    eventToDelete: null,
  });

  const today = new Date();
  // Get all days of the current month
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(state.currentMonth),
    end: endOfMonth(state.currentMonth),
  });

  // Update event list whenever events prop changes
  useEffect(() => {
    dispatch({ type: "SET_EVENT_LIST", payload: events });
  }, [events]);

  // Highlight today's date when the calendar is first rendered
  useEffect(() => {
    dispatch({ type: "SET_SELECTED_DATE", payload: today });
  }, []);

  // Handle changing the month (next/previous)
  const handleMonthChange = (direction) => {
    dispatch({ type: "SET_DIRECTION", payload: direction });
    dispatch({ type: "SET_IS_TRANSITIONING", payload: true });

    const newMonth =
      direction === "next"
        ? addMonths(state.currentMonth, 1)
        : subMonths(state.currentMonth, 1);

    // Transition the calendar smoothly
    setTimeout(() => {
      dispatch({ type: "SET_CURRENT_MONTH", payload: newMonth });
      dispatch({ type: "SET_IS_TRANSITIONING", payload: false });
    }, 300);
  };

  // Handle clicking a day on the calendar
  const handleDayClick = (day) => {
    if (isBefore(day, today) && !isToday(day)) {
      alert("Cannot select a past date!"); // Prevent selecting past dates
      return;
    }
    dispatch({ type: "SET_SELECTED_DATE", payload: day }); // Set the selected date
  };

  // Open the event modal to create a new event
  const handleCreateEventClick = () => {
    dispatch({ type: "SET_MODAL_OPEN", payload: true });
  };

  // Close the event modal
  const handleCloseModal = () => {
    dispatch({ type: "SET_MODAL_OPEN", payload: false });
    dispatch({ type: "SET_SELECTED_DATE", payload: null });
    dispatch({ type: "SET_EDITING_EVENT", payload: null });
  };

  // Handle editing an existing event
  const handleEventEdit = (event) => {
    dispatch({ type: "SET_SELECTED_DATE", payload: new Date(event.date) });
    dispatch({ type: "SET_EDITING_EVENT", payload: event });
    dispatch({ type: "SET_MODAL_OPEN", payload: true });
  };

  // Handle saving a new or edited event
  const handleEventSave = (event) => {
    if (state.editingEvent) {
      onEventEdit(event); // Update existing event
      dispatch({
        type: "SET_EVENT_LIST",
        payload: state.eventList.map((e) => (e.id === event.id ? event : e)),
      });
    } else {
      onEventAdd(event); // Add new event
      dispatch({
        type: "SET_EVENT_LIST",
        payload: [...state.eventList, event],
      });
    }
    dispatch({ type: "SET_MODAL_OPEN", payload: false });
  };

  // Handle deleting an event
  const handleEventDelete = (eventId) => {
    onEventDelete(eventId);
    dispatch({
      type: "SET_EVENT_LIST",
      payload: state.eventList.filter((event) => event.id !== eventId),
    });
    dispatch({ type: "SET_DELETE_MODAL_OPEN", payload: false });
    dispatch({ type: "SET_EVENT_TO_DELETE", payload: null });
  };

  // Open the delete confirmation modal
  const handleDeleteClick = (event) => {
    dispatch({ type: "SET_EVENT_TO_DELETE", payload: event });
    dispatch({ type: "SET_DELETE_MODAL_OPEN", payload: true });
  };

  // Handle canceling the delete action
  const handleCancelDelete = () => {
    dispatch({ type: "SET_DELETE_MODAL_OPEN", payload: false });
    dispatch({ type: "SET_EVENT_TO_DELETE", payload: null });
  };

  // Filter events for the selected date
  const filteredEvents = state.selectedDate
    ? state.eventList.filter(
        (event) =>
          format(event.date, "yyyy-MM-dd") ===
          format(state.selectedDate, "yyyy-MM-dd")
      )
    : [];

  // Reset the transitioning state when the transition ends
  const handleTransitionEnd = () => {
    dispatch({ type: "SET_IS_TRANSITIONING", payload: false });
  };

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.calendarHeader}>
        <button onClick={() => handleMonthChange("prev")}>Prev</button>
        <span>{format(state.currentMonth, "MMMM yyyy")}</span>
        <button onClick={() => handleMonthChange("next")}>Next</button>
      </div>

      <div
        className={styles.calendarWrapper}
        style={{
          transform: state.isTransitioning
            ? state.direction === "next"
              ? "translateX(110%)"
              : "translateX(-110%)"
            : "translateX(0)",
          transition: "transform 0.3s ease",
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        <div className={styles.calendarGrid}>
          {daysInMonth.map((day) => (
            <div
              key={day}
              className={`${styles.calendarDay} 
              ${
                state.selectedDate?.toDateString() === day.toDateString()
                  ? styles.selected
                  : ""
              } 
              ${isBefore(day, today) && !isToday(day) ? styles.disabled : ""} 
              ${isToday(day) ? styles.current : ""}`} // Highlight today's date
              onClick={() => handleDayClick(day)}
            >
              <span>{format(day, "d")}</span>
              {state.eventList.filter(
                (event) =>
                  format(event.date, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
              ).length > 0 && (
                <div className={styles.eventMarker}>
                  {state.eventList.filter(
                    (event) =>
                      format(event.date, "yyyy-MM-dd") ===
                      format(day, "yyyy-MM-dd")
                  ).length > 1 ? (
                    <>
                      {
                        state.eventList.filter(
                          (event) =>
                            format(event.date, "yyyy-MM-dd") ===
                            format(day, "yyyy-MM-dd")
                        ).length
                      }
                      <span> Events</span>
                    </>
                  ) : (
                    <>
                      {
                        state.eventList.filter(
                          (event) =>
                            format(event.date, "yyyy-MM-dd") ===
                            format(day, "yyyy-MM-dd")
                        ).length
                      }
                      <span> Event</span>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {state.selectedDate && (
        <div className={styles.eventCreation}>
          <h3>
            Create Event for {format(state.selectedDate, "dd MMMM, yyyy")}
          </h3>
          <button onClick={handleCreateEventClick}>Create Event</button>
        </div>
      )}

      {state.selectedDate && (
        <div className={styles.eventsList}>
          <h3>Events for {format(state.selectedDate, "dd MMMM, yyyy")}</h3>
          {filteredEvents.length === 0 ? (
            <p>No events for this day.</p>
          ) : (
            filteredEvents.map((event) => (
              <div key={event.id} className={styles.eventItem}>
                <div className={styles.eventTitle}>{event.title}</div>
                <div>{event.description}</div>
                <div className={styles.eventActions}>
                  <button onClick={() => handleEventEdit(event)}>Edit</button>
                  <button onClick={() => handleDeleteClick(event)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {state.isModalOpen && (
        <EventModal
          selectedDate={state.selectedDate}
          onSave={handleEventSave}
          onClose={handleCloseModal}
          event={state.editingEvent}
        />
      )}

      {state.isDeleteModalOpen && state.eventToDelete && (
        <ConfirmationModal
          event={state.eventToDelete}
          onConfirm={handleEventDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default Calendar;
