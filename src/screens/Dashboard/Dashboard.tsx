import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Alert,
} from 'react-native';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../theme';
import { CustomButton } from '../../components/CustomButton';
import { SidebarLayout } from '../../components/SidebarLayout';
import { useApp } from '../../context/AppContext';

const { width } = Dimensions.get('window');

interface DashboardProps {
  navigation: any;
}

export const Dashboard: React.FC<DashboardProps> = ({ navigation }) => {
  const { appointments } = useApp();

  const hour = new Date().getHours();
  let greeting = 'Good Morning';
  if (hour >= 12 && hour < 17) {
    greeting = 'Good Afternoon';
  } else if (hour >= 17) {
    greeting = 'Good Evening';
  }

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <SidebarLayout navigation={navigation} title="Dashboard">
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Row */}
        <View style={styles.welcomeRow}>
          <View>
            <Text style={styles.greetingText}>{greeting},</Text>
            <Text style={styles.userNameText}>Alex Rivera</Text>
          </View>
          <TouchableOpacity style={styles.profileBadge} activeOpacity={0.8}>
            <Text style={styles.profileBadgeText}>AR</Text>
          </TouchableOpacity>
        </View>

        {/* Highlight Card / Banner */}
        <View style={styles.bannerCard}>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>Daily Health Tip</Text>
            <Text style={styles.bannerSubtitle}>
              Stay hydrated! Drink at least 8 glasses of water today to keep your energy levels up.
            </Text>
          </View>
          <View style={styles.bannerProgressContainer}>
            <Text style={styles.bannerPercent}>75%</Text>
            <Text style={styles.bannerProgressLabel}>Water Goal</Text>
          </View>
        </View>

        {/* Quick Stats Grid */}
        <Text style={styles.sectionTitle}>Today's Vitals</Text>
        <View style={styles.statsGrid}>
          {/* Stat 1 */}
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, styles.statIconContainerRed]}>
              <Text style={styles.statIcon}>❤️</Text>
            </View>
            <Text style={styles.statLabel}>Heart Rate</Text>
            <Text style={styles.statValue}>72 <Text style={styles.statUnit}>bpm</Text></Text>
            <Text style={styles.statStatus}>Normal</Text>
          </View>

          {/* Stat 2 */}
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, styles.statIconContainerGreen]}>
              <Text style={styles.statIcon}>👟</Text>
            </View>
            <Text style={styles.statLabel}>Steps</Text>
            <Text style={styles.statValue}>8,432</Text>
            <Text style={styles.statStatus}>Goal: 10k</Text>
          </View>

          {/* Stat 3 */}
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, styles.statIconContainerIndigo]}>
              <Text style={styles.statIcon}>😴</Text>
            </View>
            <Text style={styles.statLabel}>Sleep</Text>
            <Text style={styles.statValue}>7h 45m</Text>
            <Text style={styles.statStatus}>Deep Sleep</Text>
          </View>

          {/* Stat 4 */}
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, styles.statIconContainerOrange]}>
              <Text style={styles.statIcon}>🔥</Text>
            </View>
            <Text style={styles.statLabel}>Active Calories</Text>
            <Text style={styles.statValue}>420 <Text style={styles.statUnit}>kcal</Text></Text>
            <Text style={styles.statStatus}>Active</Text>
          </View>
        </View>

        {/* Upcoming Appointments */}
        <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
        
        {appointments.length === 0 ? (
          <View style={styles.emptyAppointmentsCard}>
            <Text style={styles.emptyText}>No upcoming appointments scheduled.</Text>
            <TouchableOpacity
              style={styles.bookShortcutButton}
              onPress={() => navigation.navigate('MakeAppointment')}
              activeOpacity={0.7}
            >
              <Text style={styles.bookShortcutText}>Book an Appointment</Text>
            </TouchableOpacity>
          </View>
        ) : (
          appointments.map((appt) => {
            const docInitials = appt.doctorName
              .replace('Dr. ', '')
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2);

            return (
              <View key={appt.id} style={styles.appointmentCard}>
                <View style={styles.appointmentHeader}>
                  <View style={styles.doctorAvatar}>
                    <Text style={styles.doctorAvatarText}>{docInitials || 'DR'}</Text>
                  </View>
                  <View style={styles.appointmentInfo}>
                    <Text style={styles.doctorName}>{appt.doctorName}</Text>
                    <Text style={styles.doctorSpecialty}>{appt.specialty}</Text>
                  </View>
                </View>

                {/* Patient Details Row */}
                <View style={styles.patientBadge}>
                  <Text style={styles.patientLabel}>Patient: </Text>
                  <Text style={styles.patientValue}>{appt.patientName}</Text>
                </View>

                <View style={styles.appointmentFooter}>
                  <View style={styles.dateTimeBadge}>
                    <Text style={styles.dateTimeText}>📅 {appt.date}, {appt.time}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.joinButton}
                    onPress={() =>
                      Alert.alert(
                        'Telehealth Consultation',
                        `Connecting to secure virtual consultation for ${appt.patientName}...`
                      )
                    }
                    activeOpacity={0.7}
                  >
                    <Text style={styles.joinButtonText}>Join Call</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <CustomButton
            title="Register New Patient"
            onPress={() => navigation.navigate('EnterPatient')}
            style={styles.actionButton}
          />
          <CustomButton
            title="Log Out"
            variant="outline"
            onPress={handleLogout}
            style={styles.logoutButton}
          />
        </View>
      </ScrollView>
    </SidebarLayout>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  welcomeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    marginTop: Spacing.xs,
  },
  greetingText: {
    ...Typography.caption,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  userNameText: {
    ...Typography.header,
    fontSize: 26,
    marginTop: Spacing.xs,
  },
  profileBadge: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  profileBadgeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  bannerCard: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBackground,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
    alignItems: 'center',
    ...Shadows.md,
  },
  bannerContent: {
    flex: 1,
    paddingRight: Spacing.sm,
  },
  bannerTitle: {
    color: Colors.accent,
    fontWeight: '700',
    fontSize: 16,
    marginBottom: Spacing.xs,
  },
  bannerSubtitle: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  bannerProgressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    width: 75,
    height: 75,
  },
  bannerPercent: {
    color: Colors.primaryLight,
    fontWeight: '800',
    fontSize: 20,
  },
  bannerProgressLabel: {
    color: Colors.textMuted,
    fontSize: 9,
    marginTop: 2,
    textAlign: 'center',
  },
  sectionTitle: {
    ...Typography.header,
    fontSize: 18,
    marginBottom: Spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  statCard: {
    width: (width - Spacing.lg * 2 - Spacing.md) / 2,
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  statIconContainerRed: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  statIconContainerGreen: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  statIconContainerIndigo: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  statIconContainerOrange: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },
  statIcon: {
    fontSize: 18,
  },
  statLabel: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
    marginBottom: Spacing.xs,
  },
  statValue: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  statUnit: {
    fontSize: 12,
    fontWeight: 'normal',
    color: Colors.textSecondary,
  },
  statStatus: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: Spacing.xs,
  },
  appointmentCard: {
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  appointmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  doctorAvatar: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doctorAvatarText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  appointmentInfo: {
    marginLeft: Spacing.md,
  },
  doctorName: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  doctorSpecialty: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  patientBadge: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    alignSelf: 'flex-start',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  patientLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  patientValue: {
    color: Colors.primaryLight,
    fontWeight: '600',
    fontSize: 12,
  },
  appointmentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.md,
  },
  dateTimeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateTimeText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  joinButton: {
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
  },
  emptyAppointmentsCard: {
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
    ...Shadows.sm,
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  bookShortcutButton: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  bookShortcutText: {
    color: Colors.primaryLight,
    fontWeight: '700',
    fontSize: 13,
  },
  actionContainer: {
    marginTop: Spacing.lg,
  },
  actionButton: {
    marginBottom: Spacing.sm,
  },
  logoutButton: {
    borderColor: Colors.error,
  },
});
