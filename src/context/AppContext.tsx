import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Patient {
  id: string;
  title: string;
  name: string;
  phone: string;
  email: string;
  gender: string;
  dob: string;
  address: string;
  state: string;
  pincode: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}

interface AppContextType {
  patients: Patient[];
  appointments: Appointment[];
  addPatient: (patient: Omit<Patient, 'id'>) => Patient;
  addAppointment: (appointment: Omit<Appointment, 'id' | 'status'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: 'p1',
      title: 'Mr.',
      name: 'Alex Rivera',
      phone: '555-0199',
      email: 'alex.rivera@example.com',
      gender: 'Male',
      dob: '1990-05-15',
      address: '123 Pine St',
      state: 'California',
      pincode: '90210',
    },
  ]);

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 'a1',
      patientId: 'p1',
      patientName: 'Alex Rivera',
      doctorName: 'Dr. Sarah Jenkins',
      specialty: 'Cardiologist',
      date: 'Tomorrow',
      time: '10:00 AM',
      status: 'Scheduled',
    },
  ]);

  const addPatient = (newPatient: Omit<Patient, 'id'>) => {
    const patient: Patient = {
      ...newPatient,
      id: `p-${Date.now()}`,
    };
    setPatients((prev) => [...prev, patient]);
    return patient;
  };

  const addAppointment = (newAppointment: Omit<Appointment, 'id' | 'status'>) => {
    const appointment: Appointment = {
      ...newAppointment,
      id: `a-${Date.now()}`,
      status: 'Scheduled',
    };
    setAppointments((prev) => [appointment, ...prev]);
  };

  return (
    <AppContext.Provider value={{ patients, appointments, addPatient, addAppointment }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
