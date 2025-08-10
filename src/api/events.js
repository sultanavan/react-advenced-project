const API_URL = "http://localhost:3000/events";

export const fetchEvents = async () => {
  const res = await fetch(API_URL);
  return res.json();
};

export const getEvent = async (id) => {
  const res = await fetch(`${API_URL}/${id}`);
  return res.json();
};

export const addEvent = async (event) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  });
  return res.json();
};

export const updateEvent = async (id, updatedEvent) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedEvent),
  });
  return res.json();
};

export const deleteEvent = async (id) => {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
};
