import { useState, useEffect } from 'react'; 

export default function App() {
  // Core state management for system operational flow
  const [scheduleData, setScheduleData] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPatient, setCurrentPatient] = useState('');
  const [chosenDate, setChosenDate] = useState('');
  
  // Explicit validation flags for unhappy paths
  const [formAlerts, setFormAlerts] = useState({ patientName: false, appointmentDate: false });

  // Simulating 3G network latency for pulling system records
  useEffect(() => {
    setIsProcessing(true);
    const syncSession = setTimeout(() => {
      setScheduleData([
        { id: 101, clientName: 'Rahul Sharma', dateString: '2026-07-05' },
        { id: 102, clientName: 'Amit Verma', dateString: '2026-07-06' }
      ]);
      setIsProcessing(false);
    }, 1500);

    return () => clearTimeout(syncSession);
  }, []);

  // Manual XSS Sanitization routine to secure corporate input state
  const deepSanitize = (rawString) => {
    const HTML_CHAR_MAP = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;'
    };
    return rawString.replace(/[&<>"']/g, (char) => HTML_CHAR_MAP[char]);
  };

  // Processing appointment form workflows
  const commitAppointment = (e) => {
    e.preventDefault();
    
    const submissionChecks = {
      patientName: !currentPatient.trim(),
      appointmentDate: !chosenDate.trim()
    };
    
    setFormAlerts(submissionChecks);

    // Fail early if input integrity fails (Unhappy Path)
    if (submissionChecks.patientName || submissionChecks.appointmentDate) {
      return;
    }

    const compiledRecord = {
      id: Date.now(),
      clientName: deepSanitize(currentPatient),
      dateString: chosenDate
    };

    setScheduleData((prevRecords) => [...prevRecords, compiledRecord]);
    
    // Non-Functional Requirement: Telemetry Pipeline
    console.log('[Analytics] User interacted with React Calendar Widget');

    // Flush form state
    setCurrentPatient('');
    setChosenDate('');
  };

  // Config array mapping layout fields to adhere strictly to DRY engineering guidelines
  const fieldConfigurations = [
    {
      id: 'patientName',
      labelText: 'Patient Name',
      inputType: 'text',
      placeHolderText: 'Enter full name',
      bindValue: currentPatient,
      updateAction: (e) => setCurrentPatient(e.target.value),
      isInvalid: formAlerts.patientName,
      feedbackMessage: 'This field is required.'
    },
    {
      id: 'appointmentDate',
      labelText: 'Select Date',
      inputType: 'date',
      placeHolderText: '',
      bindValue: chosenDate,
      updateAction: (e) => setChosenDate(e.target.value),
      isInvalid: formAlerts.appointmentDate,
      feedbackMessage: 'Please select a date.'
    }
  ];

  return (
    <div style={{
      fontFamily: 'sans-serif',
      backgroundColor: '#ffffff',
      color: '#111111',
      minHeight: '100vh',
      padding: '32px', // Rigid corporate padding block
      boxSizing: 'border-box'
    }}>
      <header style={{ borderBottom: '1px solid #e5e5e5', paddingBottom: '16px', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>Dentist Calendar Widget</h1>
        <p style={{ color: '#666666', fontSize: '14px', marginTop: '4px' }}>Ticket ID: ENG-57896 | Core Infrastructure Overhaul</p>
      </header>

      {/* Flexible system layout layout - fully responsive across floor equipment */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        gap: '32px' 
      }}>
        
        {/* Booking Interface Module */}
        <section style={{ 
          flex: '1 1 300px', 
          border: '1px solid #111111', 
          padding: '32px', 
          boxSizing: 'border-box' 
        }}>
          <h2 style={{ fontSize: '18px', marginBottom: '16px', textAlign: 'center' }}>Book New Appointment</h2>
          
          <form onSubmit={commitAppointment} noValidate>
            {fieldConfigurations.map((config) => (
              <div key={config.id} style={{ marginBottom: config.id === 'patientName' ? '16px' : '24px' }}>
                <label htmlFor={config.id} style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  {config.labelText}
                </label>
                <input
                  id={config.id}
                  type={config.inputType}
                  aria-label={config.labelText}
                  placeholder={config.placeHolderText}
                  value={config.bindValue}
                  onChange={config.updateAction}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: config.isInvalid ? '2px solid #ff0000' : '1px solid #111111',
                    backgroundColor: '#ffffff',
                    boxSizing: 'border-box'
                  }}
                />
                {config.isInvalid && (
                  <div style={{ color: '#ff0000', fontSize: '12px', marginTop: '4px' }}>
                    {config.feedbackMessage}
                  </div>
                )}
              </div>
            ))}

            <button
              type="submit"
              aria-label="Submit Appointment"
              style={{
                backgroundColor: '#111111',
                color: '#ffffff',
                border: 'none',
                padding: '12px 24px',
                cursor: 'pointer',
                fontWeight: '600',
                width: '100%'
              }}
            >
              Confirm Appointment
            </button>
          </form>
        </section>

        {/* Dynamic Display Panel */}
        <section style={{ 
          flex: '1 1 300px', 
          border: '1px solid #e5e5e5', 
          padding: '32px', 
          boxSizing: 'border-box' 
        }}>
          <h2 style={{ fontSize: '18px', marginBottom: '16px', textAlign: 'center' }}>Upcoming Schedule</h2>

          {isProcessing ? (
            <div style={{ padding: '16px', textAlign: 'center', color: '#666666' }} aria-live="polite">
              <span style={{ fontWeight: '600' }}>Loading appointments (Simulating 3G)...</span>
            </div>
          ) : scheduleData.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', border: '1px dashed #cccccc', color: '#666666' }}>
              <p>No data found</p>
            </div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {scheduleData.map((item) => (
                <li 
                  key={item.id} 
                  style={{ 
                    padding: '16px', 
                    borderBottom: '1px solid #e5e5e5', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center' 
                  }}
                >
                  <span style={{ fontWeight: '600' }}>{item.clientName}</span>
                  <span style={{ color: '#666666', fontSize: '14px' }}>{item.dateString}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
