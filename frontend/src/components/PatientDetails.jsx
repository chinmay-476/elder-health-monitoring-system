function PatientDetails({
  patient,
  healthHistory,
  patientAlerts,
  userRole,
  onOpenHealthForm,
  onEmergencyClick,
  onEditPatient,
  onEditHealthRecord,
  onMarkAlertRead,
  onCopyAccessCode,
}) {
  if (!patient) {
    return <p className="empty-state">Select a patient from the list to view history and alerts.</p>;
  }

  const latestReading = healthHistory[0];

  return (
    <div className="detail-stack">
      <article className="panel-card">
        <div className="panel-header">
          <div>
            <h2>{patient.name}</h2>
            <p>
              Age {patient.age} - {patient.gender}
            </p>
          </div>

          <div className="detail-actions">
            {userRole === 'careManager' && (
              <>
                <button type="button" className="primary-button" onClick={onOpenHealthForm}>
                  Add Health Data
                </button>
                <button type="button" className="secondary-button" onClick={onEditPatient}>
                  Edit Patient
                </button>
              </>
            )}

            {userRole === 'parent' && (
              <button type="button" className="danger-button" onClick={onEmergencyClick}>
                Emergency Button
              </button>
            )}
          </div>
        </div>

        <div className="patient-summary-grid">
          <div className="summary-chip">
            <span>Emergency Contact</span>
            <strong>{patient.emergencyContact?.name}</strong>
            <small>{patient.emergencyContact?.phone}</small>
          </div>

          <div className="summary-chip">
            <span>Managed By</span>
            <strong>{patient.managedBy?.name}</strong>
            <small>{patient.managedBy?.role}</small>
          </div>

          {userRole === 'careManager' && (
            <div className="summary-chip">
              <span>Patient Access Code</span>
              <strong>{patient.accessCode}</strong>
              <small>Share with one parent and multiple child accounts.</small>
              <button type="button" className="ghost-button" onClick={onCopyAccessCode}>
                Copy Code
              </button>
            </div>
          )}

          <div className="summary-chip">
            <span>Latest Reading</span>
            {latestReading ? (
              <>
                <strong>{latestReading.heartRate} bpm</strong>
                <small>{new Date(latestReading.createdAt).toLocaleString()}</small>
              </>
            ) : (
              <>
                <strong>No reading</strong>
                <small>Add the first health record</small>
              </>
            )}
          </div>
        </div>
      </article>

      <article className="panel-card">
        <div className="panel-header">
          <div>
            <h2>Health History</h2>
            <p>Most recent vitals appear first for quick review.</p>
          </div>
        </div>

        {healthHistory.length === 0 ? (
          <p className="empty-state">No health history saved for this patient yet.</p>
        ) : (
          <div className="history-list">
            {healthHistory.map((record) => (
              <article key={record._id} className="history-card">
                <div className="history-grid">
                  <div>
                    <span>Heart Rate</span>
                    <strong>{record.heartRate} bpm</strong>
                  </div>
                  <div>
                    <span>Oxygen</span>
                    <strong>{record.oxygen}%</strong>
                  </div>
                  <div>
                    <span>Blood Pressure</span>
                    <strong>
                      {record.systolicBP}/{record.diastolicBP}
                    </strong>
                  </div>
                  <div>
                    <span>Recorded By</span>
                    <strong>{record.recordedBy?.name || 'Care Manager'}</strong>
                  </div>
                </div>
                <small>{new Date(record.createdAt).toLocaleString()}</small>
                {userRole === 'careManager' && (
                  <div className="history-actions">
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => onEditHealthRecord(record)}
                    >
                      Edit Record
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </article>

      <article className="panel-card">
        <div className="panel-header">
          <div>
            <h2>Patient Alerts</h2>
            <p>Alerts created from this patient's health records.</p>
          </div>
        </div>

        {patientAlerts.length === 0 ? (
          <p className="empty-state">No alerts for this patient.</p>
        ) : (
          <div className="alerts-list">
            {patientAlerts.map((alert) => (
              <article
                key={alert._id}
                className={`alert-card ${alert.severity} ${alert.isRead ? 'read' : ''}`}
              >
                <h3>
                  {alert.type} - {alert.severity}
                </h3>
                <p>{alert.message}</p>
                <small>{new Date(alert.createdAt).toLocaleString()}</small>
                {!alert.isRead && (
                  <div className="alert-actions">
                    <button type="button" className="ghost-button" onClick={() => onMarkAlertRead(alert)}>
                      Mark Read
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </article>
    </div>
  );
}

export default PatientDetails;
