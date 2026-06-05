import React, { useState, useEffect } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '../theme';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { SidebarLayout } from '../components/SidebarLayout';
import { useApp } from '../context/AppContext';

interface MakeAppointmentScreenProps {
  navigation: any;
  route?: any;
}

export const MakeAppointmentScreen: React.FC<MakeAppointmentScreenProps> = ({
  navigation,
  route,
}) => {
  const { patients, addAppointment } = useApp();

  const routePatientId = route?.params?.patientId;

  // Form states
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  // Dropdown visibility
  const [showDropdown, setShowDropdown] = useState(false);

  // Field validation errors
  const [patientError, setPatientError] = useState('');
  const [doctorError, setDoctorError] = useState('');
  const [specialtyError, setSpecialtyError] = useState('');
  const [dateError, setDateError] = useState('');
  const [timeError, setTimeError] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  // Pre-select patient if redirected from EnterPatient
  useEffect(() => {
    if (routePatientId) {
      setSelectedPatientId(routePatientId);
    } else if (patients.length > 0 && !selectedPatientId) {
      setSelectedPatientId(patients[0].id);
    }
  }, [routePatientId, patients]);

  const selectedPatientName =
    patients.find((p) => p.id === selectedPatientId)?.name || 'Select Patient';

  const validate = () => {
    let isValid = true;
    setPatientError('');
    setDoctorError('');
    setSpecialtyError('');
    setDateError('');
    setTimeError('');

    if (!selectedPatientId) {
      setPatientError('Please select a patient');
      isValid = false;
    }

    if (!doctorName.trim()) {
      setDoctorError('Doctor name is required');
      isValid = false;
    }

    if (!specialty.trim()) {
      setSpecialtyError('Specialty is required');
      isValid = false;
    }

    if (!date.trim()) {
      setDateError('Appointment date is required');
      isValid = false;
    }

    if (!time.trim()) {
      setTimeError('Appointment time is required');
      isValid = false;
    }

    return isValid;
  };

  const handleBook = () => {
    if (validate()) {
      setIsLoading(true);
      
      const pat = patients.find((p) => p.id === selectedPatientId);
      const patientNameString = pat ? `${pat.title} ${pat.name}` : 'Unknown Patient';

      setTimeout(() => {
        setIsLoading(false);
        addAppointment({
          patientId: selectedPatientId,
          patientName: patientNameString,
          doctorName: doctorName.trim(),
          specialty: specialty.trim(),
          date: date.trim(),
          time: time.trim(),
        });

        Alert.alert('Appointment Booked', 'The appointment has been successfully scheduled!', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Dashboard'),
          },
        ]);
      }, 1000);
    }
  };

  return (
    <SidebarLayout navigation={navigation} title="Make Appointment">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.formInstructions}>
            Select a registered patient and schedule their consultation.
          </Text>

          {/* Patient Selection Dropdown */}
          <View style={styles.dropdownWrapper}>
            <Text style={styles.dropdownLabel}>Select Patient</Text>
            
            {patients.length === 0 ? (
              <View style={styles.noPatientsBox}>
                <Text style={styles.noPatientsText}>No registered patients found.</Text>
                <TouchableOpacity
                  style={styles.registerLink}
                  onPress={() => navigation.navigate('EnterPatient')}
                >
                  <Text style={styles.registerLinkText}>Register a patient first</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <TouchableOpacity
                  style={[
                    styles.dropdownTrigger,
                    showDropdown && styles.dropdownTriggerActive,
                    patientError ? styles.dropdownTriggerError : null,
                  ]}
                  onPress={() => setShowDropdown(!showDropdown)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.dropdownTriggerText}>{selectedPatientName}</Text>
                  <Text style={styles.dropdownArrow}>{showDropdown ? '▲' : '▼'}</Text>
                </TouchableOpacity>

                {patientError ? <Text style={styles.errorText}>{patientError}</Text> : null}

                {showDropdown && (
                  <View style={styles.dropdownListContainer}>
                    <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                      {patients.map((p) => (
                        <TouchableOpacity
                          key={p.id}
                          style={[
                            styles.dropdownItem,
                            selectedPatientId === p.id && styles.dropdownItemActive,
                          ]}
                          onPress={() => {
                            setSelectedPatientId(p.id);
                            setShowDropdown(false);
                          }}
                        >
                          <Text
                            style={[
                              styles.dropdownItemText,
                              selectedPatientId === p.id && styles.dropdownItemTextActive,
                            ]}
                          >
                            {p.title} {p.name}
                          </Text>
                          <Text style={styles.dropdownItemSub}>{p.phone}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </>
            )}
          </View>

          {/* Doctor Details */}
          <CustomInput
            label="Doctor Name"
            placeholder="e.g. Dr. Sarah Jenkins"
            autoCapitalize="words"
            value={doctorName}
            onChangeText={setDoctorName}
            error={doctorError}
          />

          <CustomInput
            label="Doctor Specialty"
            placeholder="e.g. Cardiologist"
            autoCapitalize="words"
            value={specialty}
            onChangeText={setSpecialty}
            error={specialtyError}
          />

          {/* Date & Time Grid */}
          <View style={styles.rowGrid}>
            <View style={styles.halfWidth}>
              <CustomInput
                label="Date"
                placeholder="e.g. Tomorrow"
                value={date}
                onChangeText={setDate}
                error={dateError}
              />
            </View>
            <View style={styles.halfWidth}>
              <CustomInput
                label="Time"
                placeholder="e.g. 10:00 AM"
                value={time}
                onChangeText={setTime}
                error={timeError}
              />
            </View>
          </View>

          {/* Book Button */}
          <CustomButton
            title="Book Appointment"
            onPress={handleBook}
            loading={isLoading}
            disabled={patients.length === 0}
            style={styles.bookButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SidebarLayout>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  formInstructions: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  dropdownWrapper: {
    marginBottom: Spacing.md,
    zIndex: 10,
    width: '100%',
  },
  dropdownLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dropdownTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: 52,
  },
  dropdownTriggerActive: {
    borderColor: Colors.primary,
  },
  dropdownTriggerError: {
    borderColor: Colors.error,
  },
  dropdownTriggerText: {
    color: Colors.text,
    fontSize: 15,
  },
  dropdownArrow: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  dropdownListContainer: {
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.xs,
    maxHeight: 180,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownScroll: {
    paddingVertical: 4,
  },
  dropdownItem: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  dropdownItemActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
  },
  dropdownItemText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  dropdownItemTextActive: {
    color: Colors.primaryLight,
    fontWeight: '700',
  },
  dropdownItemSub: {
    ...Typography.caption,
    marginTop: 2,
    fontSize: 11,
  },
  noPatientsBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
  },
  noPatientsText: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  registerLink: {
    paddingVertical: Spacing.xs,
  },
  registerLinkText: {
    color: Colors.primaryLight,
    fontWeight: '700',
    fontSize: 14,
  },
  rowGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  halfWidth: {
    width: '48%',
  },
  bookButton: {
    marginTop: Spacing.lg,
  },
  errorText: {
    ...Typography.error,
    marginTop: Spacing.xs,
  },
});
