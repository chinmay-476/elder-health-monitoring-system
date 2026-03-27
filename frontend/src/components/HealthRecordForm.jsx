function HealthRecordForm({ formData, onChange, onSubmit, onCancel, isSubmitting, patientName }) {
  return (
    <form className="dashboard-form" onSubmit={onSubmit}>
      <p className="form-note">
        Adding vitals for <strong>{patientName}</strong>
      </p>

      <div className="dashboard-form-grid">
        <label>
          Heart Rate
          <input
            type="number"
            name="heartRate"
            value={formData.heartRate}
            onChange={onChange}
            placeholder="78"
            min="1"
            required
          />
        </label>

        <label>
          Oxygen
          <input
            type="number"
            name="oxygen"
            value={formData.oxygen}
            onChange={onChange}
            placeholder="96"
            min="1"
            max="100"
            required
          />
        </label>

        <label>
          Systolic BP
          <input
            type="number"
            name="systolicBP"
            value={formData.systolicBP}
            onChange={onChange}
            placeholder="130"
            min="1"
            required
          />
        </label>

        <label>
          Diastolic BP
          <input
            type="number"
            name="diastolicBP"
            value={formData.diastolicBP}
            onChange={onChange}
            placeholder="84"
            min="1"
            required
          />
        </label>
      </div>

      <div className="form-actions">
        <button type="button" className="ghost-button" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="primary-button" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Health Data'}
        </button>
      </div>
    </form>
  );
}

export default HealthRecordForm;
