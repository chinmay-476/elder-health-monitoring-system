function AlertList({ alerts, onMarkRead }) {
  if (alerts.length === 0) {
    return <p className="empty-state">No alerts yet. They will appear here automatically.</p>;
  }

  return (
    <div className="alerts-list">
      {alerts.map((alert) => (
        <article
          key={alert._id}
          className={`alert-card ${alert.severity} ${alert.isRead ? 'read' : ''}`}
        >
          <h3>
            {alert.type} - {alert.severity}
          </h3>
          <p>{alert.message}</p>
          <div className="alert-meta">
            <small>Patient: {alert.patient?.name || 'Unknown patient'}</small>
            <small>{new Date(alert.createdAt).toLocaleString()}</small>
          </div>
          {!alert.isRead && (
            <div className="alert-actions">
              <button type="button" className="ghost-button" onClick={() => onMarkRead(alert)}>
                Mark Read
              </button>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}

export default AlertList;
