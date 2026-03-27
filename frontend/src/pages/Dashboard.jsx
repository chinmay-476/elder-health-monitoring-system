import { useEffect, useEffectEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AlertList from '../components/AlertList';
import HealthRecordForm from '../components/HealthRecordForm';
import PatientDetails from '../components/PatientDetails';
import PatientForm from '../components/PatientForm';
import PatientList from '../components/PatientList';
import {
  alertService,
  authService,
  clearStoredUser,
  getStoredUser,
  healthService,
  patientService,
  saveStoredUser,
} from '../services/api';
import './Dashboard.css';

const emptyPatientForm = {
  name: '',
  age: '',
  gender: 'Male',
  emergencyName: '',
  emergencyPhone: '',
};

const emptyHealthForm = {
  heartRate: '',
  oxygen: '',
  systolicBP: '',
  diastolicBP: '',
};

const roleSummary = {
  careManager: 'You can add patients and manage health data for the entire system.',
  parent: 'You can view patient data and use the emergency button when quick action is needed.',
  child: 'You can view patient history and alerts in read-only mode.',
};

function Dashboard() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [patients, setPatients] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [healthHistory, setHealthHistory] = useState([]);
  const [patientAlerts, setPatientAlerts] = useState([]);
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [showHealthForm, setShowHealthForm] = useState(false);
  const [patientForm, setPatientForm] = useState(emptyPatientForm);
  const [healthForm, setHealthForm] = useState(emptyHealthForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingPatient, setIsSavingPatient] = useState(false);
  const [isSavingHealth, setIsSavingHealth] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const loadInitialDashboard = useEffectEvent(async (storedUser) => {
    await refreshDashboard(storedUser);
  });

  const showCareManagerNotice = useEffectEvent((user) => {
    if (user?.role !== 'careManager') {
      return;
    }

    if (sessionStorage.getItem('careManagerLoginNoticeShown') === 'true') {
      return;
    }

    sessionStorage.setItem('careManagerLoginNoticeShown', 'true');
    window.alert(
      'Care Manager Instructions:\n1. Select a patient from the directory.\n2. Add a patient if needed.\n3. Add health data for the selected patient.\n4. Review alerts after saving vitals.'
    );
  });

  useEffect(() => {
    const storedUser = getStoredUser();

    if (!storedUser?.token) {
      navigate('/login', { replace: true });
      return;
    }

    setUserInfo(storedUser);
    loadInitialDashboard(storedUser);
    showCareManagerNotice(storedUser);
  }, [navigate]);

  const refreshDashboard = async (currentUser = getStoredUser(), preferredPatientId = selectedPatientId) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const [profileResponse, patientsResponse, alertsResponse] = await Promise.all([
        authService.getProfile(),
        patientService.getPatients(),
        alertService.getAlerts(),
      ]);

      const mergedUser = {
        ...currentUser,
        _id: profileResponse.data._id,
        name: profileResponse.data.name,
        email: profileResponse.data.email,
        role: profileResponse.data.role,
      };

      saveStoredUser(mergedUser);
      setUserInfo(mergedUser);
      setPatients(patientsResponse.data);
      setAlerts(alertsResponse.data);

      const nextPatientId = preferredPatientId || patientsResponse.data[0]?._id || '';
      setSelectedPatientId(nextPatientId);

      if (nextPatientId) {
        await loadPatientDetails(nextPatientId);
      } else {
        setSelectedPatient(null);
        setHealthHistory([]);
        setPatientAlerts([]);
      }
    } catch (error) {
      handleRequestError(error, 'Unable to load dashboard data.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadPatientDetails = async (patientId) => {
    try {
      const response = await patientService.getPatientById(patientId);
      setSelectedPatient(response.data.patient);
      setHealthHistory(response.data.healthHistory);
      setPatientAlerts(response.data.alerts);
    } catch (error) {
      handleRequestError(error, 'Unable to load patient details.');
    }
  };

  const handleRequestError = (error, fallbackMessage) => {
    const message = error.response?.data?.message || fallbackMessage;

    if (error.response?.status === 401) {
      clearStoredUser();
      navigate('/login', { replace: true });
      return;
    }

    setErrorMessage(message);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('careManagerLoginNoticeShown');
    clearStoredUser();
    navigate('/login', { replace: true });
  };

  const handleSelectPatient = async (patientId) => {
    setSelectedPatientId(patientId);
    setShowHealthForm(false);
    await loadPatientDetails(patientId);
  };

  const handlePatientFormChange = (event) => {
    setPatientForm((currentValue) => ({
      ...currentValue,
      [event.target.name]: event.target.value,
    }));
  };

  const handleHealthFormChange = (event) => {
    setHealthForm((currentValue) => ({
      ...currentValue,
      [event.target.name]: event.target.value,
    }));
  };

  const handleAddPatient = async (event) => {
    event.preventDefault();
    setIsSavingPatient(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await patientService.addPatient({
        name: patientForm.name,
        age: Number(patientForm.age),
        gender: patientForm.gender,
        emergencyContact: {
          name: patientForm.emergencyName,
          phone: patientForm.emergencyPhone,
        },
      });

      setPatientForm(emptyPatientForm);
      setShowPatientForm(false);
      setSuccessMessage(
        `Patient added successfully. Access code: ${response.data.accessCode}. Share this with one parent and any number of child accounts.`
      );
      await refreshDashboard(getStoredUser(), response.data._id);
    } catch (error) {
      handleRequestError(error, 'Unable to save the patient.');
    } finally {
      setIsSavingPatient(false);
    }
  };

  const handleAddHealthData = async (event) => {
    event.preventDefault();

    if (!selectedPatientId) {
      setErrorMessage('Select a patient before adding health data.');
      return;
    }

    setIsSavingHealth(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await healthService.addRecord({
        patientId: selectedPatientId,
        heartRate: Number(healthForm.heartRate),
        oxygen: Number(healthForm.oxygen),
        systolicBP: Number(healthForm.systolicBP),
        diastolicBP: Number(healthForm.diastolicBP),
      });

      setHealthForm(emptyHealthForm);
      setShowHealthForm(false);
      setSuccessMessage(
        response.data.alertsCount > 0
          ? `Health data saved. ${response.data.alertsCount} alert(s) were generated.`
          : 'Health data saved. No alert was triggered.'
      );
      await refreshDashboard(getStoredUser(), selectedPatientId);
    } catch (error) {
      handleRequestError(error, 'Unable to save health data.');
    } finally {
      setIsSavingHealth(false);
    }
  };

  const handleEditPatient = async () => {
    if (!selectedPatient) return;

    const name = window.prompt('Patient name', selectedPatient.name);
    if (name === null) return;
    const ageValue = window.prompt('Age', String(selectedPatient.age));
    if (ageValue === null) return;
    const gender = window.prompt('Gender (Male/Female/Other)', selectedPatient.gender);
    if (gender === null) return;
    const emergencyName = window.prompt(
      'Emergency contact name',
      selectedPatient.emergencyContact?.name || ''
    );
    if (emergencyName === null) return;
    const emergencyPhone = window.prompt(
      'Emergency contact phone',
      selectedPatient.emergencyContact?.phone || ''
    );
    if (emergencyPhone === null) return;

    setErrorMessage('');
    setSuccessMessage('');

    try {
      await patientService.updatePatient(selectedPatient._id, {
        name,
        age: Number(ageValue),
        gender,
        emergencyContact: {
          name: emergencyName,
          phone: emergencyPhone,
        },
      });
      setSuccessMessage('Patient updated successfully.');
      await refreshDashboard(getStoredUser(), selectedPatient._id);
    } catch (error) {
      handleRequestError(error, 'Unable to update the patient.');
    }
  };

  const handleEditHealthRecord = async (record) => {
    const heartRateValue = window.prompt('Heart rate', String(record.heartRate));
    if (heartRateValue === null) return;
    const oxygenValue = window.prompt('Oxygen', String(record.oxygen));
    if (oxygenValue === null) return;
    const systolicValue = window.prompt('Systolic BP', String(record.systolicBP));
    if (systolicValue === null) return;
    const diastolicValue = window.prompt('Diastolic BP', String(record.diastolicBP));
    if (diastolicValue === null) return;

    setErrorMessage('');
    setSuccessMessage('');

    try {
      await healthService.updateRecord(record._id, {
        heartRate: Number(heartRateValue),
        oxygen: Number(oxygenValue),
        systolicBP: Number(systolicValue),
        diastolicBP: Number(diastolicValue),
      });
      setSuccessMessage('Health record updated successfully.');
      await refreshDashboard(getStoredUser(), selectedPatientId);
    } catch (error) {
      handleRequestError(error, 'Unable to update the health record.');
    }
  };

  const handleMarkAlertRead = async (alert) => {
    try {
      await alertService.markRead(alert._id);
      await refreshDashboard(getStoredUser(), selectedPatientId);
    } catch (error) {
      handleRequestError(error, 'Unable to mark alert as read.');
    }
  };

  const handleCopyAccessCode = async () => {
    if (!selectedPatient?.accessCode) return;

    try {
      await navigator.clipboard.writeText(selectedPatient.accessCode);
      setSuccessMessage('Access code copied to clipboard.');
    } catch {
      setSuccessMessage(`Access code: ${selectedPatient.accessCode}`);
    }
  };

  const handleEmergencyClick = () => {
    if (!selectedPatient?.emergencyContact?.phone) {
      return;
    }

    const phoneNumber = selectedPatient.emergencyContact.phone.replace(/\s+/g, '');
    window.location.href = `tel:${phoneNumber}`;
  };

  const canManageHealthData = userInfo?.role === 'careManager';

  return (
    <div className="dashboard-page">
      <div className="dashboard-shell">
        <header className="dashboard-hero">
          <div>
            <p className="dashboard-eyebrow">Elder Health Monitoring System</p>
            <h1>Protected dashboard with alerts, history, and role-based actions.</h1>
            <p className="dashboard-copy">{roleSummary[userInfo?.role] || roleSummary.child}</p>
          </div>

          <div className="hero-actions">
            <div className="dashboard-user-box">
              <span className="role-pill">{userInfo?.role}</span>
              <strong>{userInfo?.name}</strong>
              <small>{userInfo?.email}</small>
            </div>
            <button type="button" className="secondary-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        <div className="status-stack">
          {errorMessage && <div className="status-banner status-error">{errorMessage}</div>}
          {successMessage && <div className="status-banner status-success">{successMessage}</div>}
        </div>

        <main className="dashboard-grid">
          <aside className="panel-card">
            <div className="panel-header">
              <div>
                <h2>Patient Directory</h2>
                <p>Select a patient to view details and history.</p>
              </div>
            </div>

            <PatientList
              patients={patients}
              selectedPatientId={selectedPatientId}
              onSelectPatient={handleSelectPatient}
              userRole={userInfo?.role}
            />
          </aside>

          <section className="detail-stack">
            {isLoading ? (
              <p className="empty-state">Loading dashboard...</p>
            ) : (
              <PatientDetails
                patient={selectedPatient}
                healthHistory={healthHistory}
                patientAlerts={patientAlerts}
                userRole={userInfo?.role}
                onOpenHealthForm={() => setShowHealthForm(true)}
                onEmergencyClick={handleEmergencyClick}
                onEditPatient={handleEditPatient}
                onEditHealthRecord={handleEditHealthRecord}
                onMarkAlertRead={handleMarkAlertRead}
                onCopyAccessCode={handleCopyAccessCode}
              />
            )}
          </section>

          <aside className="right-column">
            <article className="panel-card">
              <div className="panel-header">
                <div>
                  <h2>Quick Summary</h2>
                  <p>Small snapshot of the current system state.</p>
                </div>
              </div>

              <div className="mini-stats">
                <div className="mini-stat">
                  <span>Total Patients</span>
                  <strong>{patients.length}</strong>
                </div>
                <div className="mini-stat">
                  <span>Total Alerts</span>
                  <strong>{alerts.length}</strong>
                </div>
              </div>
            </article>

            {canManageHealthData && (
              <article className="panel-card">
                <div className="panel-header">
                  <div>
                    <h2>Care Manager Tools</h2>
                    <p>Only care managers can add patients and health data.</p>
                  </div>
                  <button
                    type="button"
                    className="primary-button"
                    onClick={() => setShowPatientForm((currentValue) => !currentValue)}
                  >
                    {showPatientForm ? 'Close Form' : 'Add Patient'}
                  </button>
                </div>

                {showPatientForm && (
                  <PatientForm
                    formData={patientForm}
                    onChange={handlePatientFormChange}
                    onSubmit={handleAddPatient}
                    onCancel={() => setShowPatientForm(false)}
                    isSubmitting={isSavingPatient}
                  />
                )}

                {showHealthForm && selectedPatient && (
                  <HealthRecordForm
                    formData={healthForm}
                    onChange={handleHealthFormChange}
                    onSubmit={handleAddHealthData}
                    onCancel={() => setShowHealthForm(false)}
                    isSubmitting={isSavingHealth}
                    patientName={selectedPatient.name}
                  />
                )}
              </article>
            )}

            <article className="panel-card">
              <div className="panel-header">
                <div>
                  <h2>System Alerts</h2>
                  <p>Latest alerts from all patient records.</p>
                </div>
              </div>

              <AlertList alerts={alerts} onMarkRead={handleMarkAlertRead} />
            </article>
          </aside>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
