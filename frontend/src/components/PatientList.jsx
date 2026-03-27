function PatientList({ patients, selectedPatientId, onSelectPatient, userRole }) {
  if (patients.length === 0) {
    return (
      <p className="empty-state">
        {userRole === 'careManager'
          ? 'No patients available yet. Add the first patient to generate an access code.'
          : 'No patient linked to this account. Ask your care manager for the patient access code.'}
      </p>
    );
  }

  return (
    <div className="patient-list">
      {patients.map((patient) => (
        <button
          key={patient._id}
          type="button"
          className={`patient-list-item ${selectedPatientId === patient._id ? 'active' : ''}`}
          onClick={() => onSelectPatient(patient._id)}
        >
          <div>
            <strong>{patient.name}</strong>
            <small>
              Age {patient.age} - {patient.gender}
            </small>
          </div>
          <span>{patient.managedBy?.name || 'Care Manager'}</span>
        </button>
      ))}
    </div>
  );
}

export default PatientList;
