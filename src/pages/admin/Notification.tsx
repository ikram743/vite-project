import React, { useState } from "react";
import "./Notification.css";

const Notifications: React.FC = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState("all");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    // API call to send notification
  };

  return (
    <div>
      <h2>Send Notification</h2>
      <form onSubmit={handleSend}>
        <label>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
        <label>Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <label>Target</label>
        <select value={target} onChange={(e) => setTarget(e.target.value)}>
          <option value="all">All Users</option>
          <option value="donor">Donors Only</option>
          <option value="beneficiary">Beneficiaries Only</option>
        </select>
        <button type="submit">Send Notification</button>
      </form>

      <h3>Past Notifications</h3>
      {/* List of sent notifications */}
    </div>
  );
};

export default Notifications;
