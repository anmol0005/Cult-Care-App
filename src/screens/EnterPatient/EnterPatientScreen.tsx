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
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Colors, Spacing, Typography, BorderRadius } from '../../theme';
import { CustomInput } from '../../components/CustomInput';
import { CustomButton } from '../../components/CustomButton';
import { SidebarLayout } from '../../components/SidebarLayout';
import { useApp } from '../../context/AppContext';

// Define the validation schema using Zod
const patientSchema = z.object({
  title: z.enum(['Mr.', 'Mrs.', 'Ms.', 'Dr.']),
  name: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: z.string().regex(/^\d{8,15}$/, 'Phone number must be between 8 and 15 digits'),
  email: z.string().email('Please enter a valid email address'),
  gender: z.enum(['Male', 'Female', 'Other']),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD format'),
  address: z.string().min(5, 'Complete address must be at least 5 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  pincode: z.string().regex(/^\d{5,8}$/, 'Pincode must be between 5 and 8 digits'),
});

type PatientFormData = z.infer<typeof patientSchema>;

interface EnterPatientScreenProps {
  navigation: any;
}

export const EnterPatientScreen: React.FC<EnterPatientScreenProps> = ({ navigation }) => {
  const { addPatient } = useApp();
  const [isLoading, setIsLoading] = useState(false);

  const titles: ('Mr.' | 'Mrs.' | 'Ms.' | 'Dr.')[] = ['Mr.', 'Mrs.', 'Ms.', 'Dr.'];
  const genders: ('Male' | 'Female' | 'Other')[] = ['Male', 'Female', 'Other'];

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      title: 'Mr.',
      name: '',
      phone: '',
      email: '',
      gender: 'Male',
      dob: '',
      address: '',
      state: '',
      pincode: '',
    },
  });

  const watchedTitle = watch('title');
  const watchedGender = watch('gender');

  const onSubmit = (data: PatientFormData) => {
    setIsLoading(true);
    // Simulate API saving
    setTimeout(() => {
      setIsLoading(false);
      const newPatient = addPatient(data);

      Alert.alert(
        'Patient Registered',
        `Successfully registered ${data.title} ${data.name}`,
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
                    watchedTitle === t && styles.selectorActiveButton,
                  ]}
                  onPress={() => setValue('title', t)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.selectorButtonText,
                      watchedTitle === t && styles.selectorActiveButtonText,
                    ]}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.title && <Text style={styles.errorText}>{errors.title.message}</Text>}
          </View>

          {/* Full Name */}
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomInput
                label="Full Name"
                placeholder="e.g. Eleanor Vance"
                autoCapitalize="words"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.name?.message}
              />
            )}
          />

          {/* Phone Number */}
          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomInput
                label="Phone Number"
                placeholder="e.g. 5550144"
                keyboardType="phone-pad"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.phone?.message}
              />
            )}
          />

          {/* Email Address */}
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomInput
                label="Email Address"
                placeholder="e.g. eleanor@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.email?.message}
              />
            )}
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
                    watchedGender === g && styles.selectorActiveButton,
                  ]}
                  onPress={() => setValue('gender', g)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.selectorButtonText,
                      watchedGender === g && styles.selectorActiveButtonText,
                    ]}
                  >
                    {g}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.gender && <Text style={styles.errorText}>{errors.gender.message}</Text>}
          </View>

          {/* Date of Birth */}
          <Controller
            control={control}
            name="dob"
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomInput
                label="Date of Birth"
                placeholder="YYYY-MM-DD"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.dob?.message}
              />
            )}
          />

          <Text style={styles.sectionHeader}>Address Details</Text>

          {/* Complete Address */}
          <Controller
            control={control}
            name="address"
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomInput
                label="Complete Address"
                placeholder="Street address, building/apartment"
                autoCapitalize="sentences"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.address?.message}
              />
            )}
          />

          {/* State & Pincode Grid */}
          <View style={styles.rowGrid}>
            <View style={styles.halfWidth}>
              <Controller
                control={control}
                name="state"
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomInput
                    label="State"
                    placeholder="e.g. CA"
                    autoCapitalize="words"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={errors.state?.message}
                  />
                )}
              />
            </View>
            <View style={styles.halfWidth}>
              <Controller
                control={control}
                name="pincode"
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomInput
                    label="Pincode"
                    placeholder="e.g. 94016"
                    keyboardType="numeric"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={errors.pincode?.message}
                  />
                )}
              />
            </View>
          </View>

          {/* Save Button */}
          <CustomButton
            title="Register Patient"
            onPress={handleSubmit(onSubmit)}
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
  errorText: {
    ...Typography.error,
    marginTop: Spacing.xs,
  },
});
