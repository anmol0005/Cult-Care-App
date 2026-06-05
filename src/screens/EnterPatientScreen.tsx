import React, { useState } from 'react';
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

interface EnterPatientScreenProps {
  navigation: any;
}

export const EnterPatientScreen: React.FC<EnterPatientScreenProps> = ({ navigation }) => {
  const { addPatient } = useApp();

  const [selectedTitle, setSelectedTitle] = useState('Mr.');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedGender, setSelectedGender] = useState('Male');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [stateName, setStateName] = useState('');
  const [pincode, setPincode] = useState('');

  // Field validation states
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [dobError, setDobError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [stateError, setStateError] = useState('');
  const [pincodeError, setPincodeError] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);

  const titles = ['Mr.', 'Mrs.', 'Ms.', 'Dr.'];
  const genders = ['Male', 'Female', 'Other'];

  const validate = () => {
    let isValid = true;
    setNameError('');
    setPhoneError('');
    setEmailError('');
    setDobError('');
    setAddressError('');
    setStateError('');
    setPincodeError('');

    if (!name.trim()) {
      setNameError('Full name is required');
      isValid = false;
    }

    if (!phone.trim()) {
      setPhoneError('Phone number is required');
      isValid = false;
    } else if (phone.trim().length < 8) {
      setPhoneError('Enter a valid phone number');
      isValid = false;
    }

    if (!email.trim()) {
      setEmailError('Email address is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    if (!dob.trim()) {
      setDobError('Date of birth is required');
      isValid = false;
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
      setDobError('Use YYYY-MM-DD format');
      isValid = false;
    }

    if (!address.trim()) {
      setAddressError('Address is required');
      isValid = false;
    }

    if (!stateName.trim()) {
      setStateError('State is required');
      isValid = false;
    }

    if (!pincode.trim()) {
      setPincodeError('Pincode is required');
      isValid = false;
    } else if (pincode.trim().length < 5) {
      setPincodeError('Enter a valid pincode');
      isValid = false;
    }

    return isValid;
  };

  const handleSave = () => {
    if (validate()) {
      setIsLoading(true);
      
      // Simulate API saving
      setTimeout(() => {
        setIsLoading(false);
        const newPatient = addPatient({
          title: selectedTitle,
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          gender: selectedGender,
          dob: dob.trim(),
          address: address.trim(),
          state: stateName.trim(),
          pincode: pincode.trim(),
        });

        Alert.alert(
          'Patient Registered',
          `Successfully registered ${selectedTitle} ${name.trim()}`,
          [
            {
              text: 'Book Appointment Now',
              onPress: () => navigation.navigate('MakeAppointment', { patientId: newPatient.id }),
            },
            {
              text: 'Back to Dashboard',
              onPress: () => navigation.navigate('Dashboard'),
              style: 'cancel',
            },
          ]
        );
      }, 1000);
    }
  };

  return (
    <SidebarLayout navigation={navigation} title="Enter Patient">
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
            Fill out the patient details below to register them in the system.
          </Text>

          {/* Title Selector */}
          <View style={styles.selectorWrapper}>
            <Text style={styles.selectorLabel}>Title</Text>
            <View style={styles.selectorContainer}>
              {titles.map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[
                    styles.selectorButton,
                    selectedTitle === t && styles.selectorActiveButton,
                  ]}
                  onPress={() => setSelectedTitle(t)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.selectorButtonText,
                      selectedTitle === t && styles.selectorActiveButtonText,
                    ]}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Full Name */}
          <CustomInput
            label="Full Name"
            placeholder="e.g. Eleanor Vance"
            autoCapitalize="words"
            value={name}
            onChangeText={setName}
            error={nameError}
          />

          {/* Phone Number */}
          <CustomInput
            label="Phone Number"
            placeholder="e.g. 555-0144"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            error={phoneError}
          />

          {/* Email Address */}
          <CustomInput
            label="Email Address"
            placeholder="e.g. eleanor@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            error={emailError}
          />

          {/* Gender Selector */}
          <View style={styles.selectorWrapper}>
            <Text style={styles.selectorLabel}>Gender</Text>
            <View style={styles.selectorContainer}>
              {genders.map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[
                    styles.selectorButton,
                    selectedGender === g && styles.selectorActiveButton,
                  ]}
                  onPress={() => setSelectedGender(g)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.selectorButtonText,
                      selectedGender === g && styles.selectorActiveButtonText,
                    ]}
                  >
                    {g}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Date of Birth */}
          <CustomInput
            label="Date of Birth"
            placeholder="YYYY-MM-DD"
            value={dob}
            onChangeText={setDob}
            error={dobError}
          />

          <Text style={styles.sectionHeader}>Address Details</Text>

          {/* Complete Address */}
          <CustomInput
            label="Complete Address"
            placeholder="Street address, building/apartment"
            autoCapitalize="sentences"
            value={address}
            onChangeText={setAddress}
            error={addressError}
          />

          {/* State & Pincode Grid */}
          <View style={styles.rowGrid}>
            <View style={styles.halfWidth}>
              <CustomInput
                label="State"
                placeholder="e.g. CA"
                autoCapitalize="words"
                value={stateName}
                onChangeText={setStateName}
                error={stateError}
              />
            </View>
            <View style={styles.halfWidth}>
              <CustomInput
                label="Pincode"
                placeholder="e.g. 94016"
                keyboardType="numeric"
                value={pincode}
                onChangeText={setPincode}
                error={pincodeError}
              />
            </View>
          </View>

          {/* Save Button */}
          <CustomButton
            title="Register Patient"
            onPress={handleSave}
            loading={isLoading}
            style={styles.saveButton}
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
  sectionHeader: {
    ...Typography.subheader,
    fontWeight: '700',
    color: Colors.text,
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: Spacing.xs,
  },
  selectorWrapper: {
    marginBottom: Spacing.md,
    width: '100%',
  },
  selectorLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  selectorContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: 4,
    height: 52,
    alignItems: 'center',
  },
  selectorButton: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BorderRadius.sm,
  },
  selectorActiveButton: {
    backgroundColor: Colors.primary,
  },
  selectorButtonText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  selectorActiveButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  rowGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  halfWidth: {
    width: '48%',
  },
  saveButton: {
    marginTop: Spacing.lg,
  },
});
