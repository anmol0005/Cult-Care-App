import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../theme';
import { CustomButton } from '../../components/CustomButton';

const { width } = Dimensions.get('window');

interface DashboardProps {
  navigation: any;
}

export const Dashboard: React.FC<DashboardProps> = ({ navigation }) => {
  // Determine greeting based on current local time
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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
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

        {/* Upcoming Appointment */}
        <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
        <View style={styles.appointmentCard}>
          <View style={styles.appointmentHeader}>
            <View style={styles.doctorAvatar}>
              <Text style={styles.doctorAvatarText}>DJ</Text>
            </View>
            <View style={styles.appointmentInfo}>
              <Text style={styles.doctorName}>Dr. Sarah Jenkins</Text>
              <Text style={styles.doctorSpecialty}>Cardiologist</Text>
            </View>
          </View>
          <View style={styles.appointmentFooter}>
            <View style={styles.dateTimeBadge}>
              <Text style={styles.dateTimeText}>📅 Tomorrow, 10:00 AM</Text>
            </View>
            <TouchableOpacity style={styles.joinButton}>
              <Text style={styles.joinButtonText}>Join Call</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <CustomButton 
            title="Log New Vitals" 
            onPress={() => {}} 
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
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
    marginBottom: Spacing.xl,
    ...Shadows.sm,
  },
  appointmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
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
  actionContainer: {
    marginTop: Spacing.md,
  },
  actionButton: {
    marginBottom: Spacing.sm,
  },
  logoutButton: {
    borderColor: Colors.error,
  },
});
