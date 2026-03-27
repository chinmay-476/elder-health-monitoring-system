const buildAlertsFromVitals = ({
  patientId,
  healthRecordId,
  heartRate,
  oxygen,
  systolicBP,
  diastolicBP,
}) => {
  const alerts = [];

  // Heart rate outside the allowed range creates an alert severity.
  if (heartRate < 50 || heartRate > 110) {
    alerts.push({
      patient: patientId,
      healthRecord: healthRecordId,
      type: 'Heart Rate',
      message: `Heart rate ${heartRate} bpm is outside the safe range.`,
      severity: 'alert',
    });
  }

  // Oxygen below 92 is treated as critical in this assignment.
  if (oxygen < 92) {
    alerts.push({
      patient: patientId,
      healthRecord: healthRecordId,
      type: 'Oxygen',
      message: `Oxygen level dropped to ${oxygen}%. Immediate review is recommended.`,
      severity: 'critical',
    });
  }

  // High blood pressure creates a warning alert.
  if (systolicBP > 140 || diastolicBP > 90) {
    alerts.push({
      patient: patientId,
      healthRecord: healthRecordId,
      type: 'Blood Pressure',
      message: `Blood pressure ${systolicBP}/${diastolicBP} mmHg is above the warning limit.`,
      severity: 'warning',
    });
  }

  return alerts;
};

module.exports = buildAlertsFromVitals;
