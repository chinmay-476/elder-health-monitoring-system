function PatientForm({ formData, onChange, onSubmit, onCancel, isSubmitting }) {
  return (
    <form className="dashboard-form" onSubmit={onSubmit}>
      <div className="dashboard-form-grid">
        <label>
          Patient Name
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={onChange}
            placeholder="Sarla Devi"
            required
          />
        </label>

        <label>
          Age
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={onChange}
            placeholder="72"
            min="1"
            required
          />
        </label>

        <label>
          Gender
          <select name="gender" value={formData.gender} onChange={onChange}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </label>

        <label>
          Emergency Contact Name
          <input
            type="text"
            name="emergencyName"
            value={formData.emergencyName}
            onChange={onChange}
            placeholder="Aman Sharma"
            required
          />
        </label>

        <label>
          Emergency Contact Phone
          <input
            type="text"
            name="emergencyPhone"
            value={formData.emergencyPhone}
            onChange={onChange}
            placeholder="+91 9876543210"
            required
          />
        </label>
      </div>

      <div className="form-actions">
        <button type="button" className="ghost-button" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="primary-button" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Patient'}
        </button>
      </div>
    </form>
  );
}

export default PatientForm;
