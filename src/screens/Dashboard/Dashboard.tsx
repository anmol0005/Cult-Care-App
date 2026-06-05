import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import Svg, { Path, Circle, Text as SvgText } from 'react-native-svg';
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

  // Day of week mapping
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const getDayIndex = (dateStr: string) => {
    const normalized = dateStr.toLowerCase().trim();
    if (normalized.includes('mon')) return 0;
    if (normalized.includes('tue')) return 1;
    if (normalized.includes('wed')) return 2;
    if (normalized.includes('thu')) return 3;
    if (normalized.includes('fri')) return 4;
    if (normalized.includes('sat')) return 5;
    if (normalized.includes('sun')) return 6;
    if (normalized.includes('tomorrow')) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const day = tomorrow.getDay();
      return day === 0 ? 6 : day - 1;
    }
    const parsed = Date.parse(dateStr);
    if (!isNaN(parsed)) {
      const day = new Date(parsed).getDay();
      return day === 0 ? 6 : day - 1;
    }
    return -1;
  };

  const appointmentsPerDay = [0, 0, 0, 0, 0, 0, 0];
  appointments.forEach((appt) => {
    const dayIndex = getDayIndex(appt.date);
    if (dayIndex !== -1) {
      appointmentsPerDay[dayIndex]++;
    }
  });

  // Math for Line Chart
  const maxCount = Math.max(...appointmentsPerDay, 2);
  const chartHeight = 110;
  const chartWidth = width - Spacing.lg * 2 - 32;

  const lines: any[] = [];
  for (let i = 0; i < 6; i++) {
    const x1 = (chartWidth / 6) * i + 15;
    const y1 = chartHeight - (appointmentsPerDay[i] / maxCount) * (chartHeight - 35) - 15;
    const x2 = (chartWidth / 6) * (i + 1) + 15;
    const y2 = chartHeight - (appointmentsPerDay[i + 1] / maxCount) * (chartHeight - 35) - 15;

    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    lines.push({
      key: i,
      x1,
      y1,
      x2,
      y2,
      length,
      angle,
    });
  }

  // Math for Pie Chart
  const total = appointmentsPerDay.reduce((a, b) => a + b, 0);
  const colors = [
    '#6366F1', // Mon (Indigo)
    '#10B981', // Tue (Emerald)
    '#F59E0B', // Wed (Amber)
    '#EC4899', // Thu (Pink)
    '#8B5CF6', // Fri (Purple)
    '#3B82F6', // Sat (Blue)
    '#06B6D4', // Sun (Cyan)
  ];

  let accumulatedAngle = -90; // Start from the top
  const pieSlices: any[] = [];

  if (total > 0) {
    appointmentsPerDay.forEach((count, index) => {
      if (count > 0) {
        const percentage = count / total;
        const angleDelta = percentage * 360;

        if (count === total) {
          // 100% slice needs to be a circle, otherwise path calculation fails
          pieSlices.push({
            isFullCircle: true,
            color: colors[index],
            index,
            count,
            percentage: Math.round(percentage * 100),
          });
        } else {
          const startAngle = accumulatedAngle;
          const endAngle = accumulatedAngle + angleDelta;
          
          const rad = (angle: number) => (angle * Math.PI) / 180;
          const cx = 70;
          const cy = 70;
          const r = 60;
          
          const x1 = cx + r * Math.cos(rad(startAngle));
          const y1 = cy + r * Math.sin(rad(startAngle));
          const x2 = cx + r * Math.cos(rad(endAngle));
          const y2 = cy + r * Math.sin(rad(endAngle));
          
          const largeArcFlag = angleDelta > 180 ? 1 : 0;
          
          const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
          
          pieSlices.push({
            isFullCircle: false,
            pathData,
            color: colors[index],
            index,
            count,
            percentage: Math.round(percentage * 100),
          });
          
          accumulatedAngle = endAngle;
        }
      }
    });
  }

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

        {/* Weekly Analytics Section */}
        <Text style={styles.sectionTitle}>Weekly Analytics</Text>

        {/* Line Chart Card */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Appointments Trend (Line Chart)</Text>
          <View style={[styles.lineChartWrapper, { width: chartWidth }]}>
            {/* Draw grid lines */}
            <View style={styles.gridLinesContainer}>
              <View style={styles.gridLine} />
              <View style={styles.gridLine} />
              <View style={styles.gridLine} />
            </View>
            
            {/* Draw mathematical lines */}
            {lines.map((line) => (
              <View
                key={line.key}
                style={{
                  position: 'absolute',
                  left: (line.x1 + line.x2) / 2 - line.length / 2,
                  top: (line.y1 + line.y2) / 2 - 1.5,
                  width: line.length,
                  height: 3,
                  backgroundColor: Colors.primary,
                  transform: [{ rotate: `${line.angle}deg` }],
                }}
              />
            ))}
            
            {/* Draw dots */}
            {appointmentsPerDay.map((val, i) => {
              const x = (chartWidth / 6) * i + 15;
              const y = chartHeight - (val / maxCount) * (chartHeight - 35) - 15;
              return (
                <React.Fragment key={i}>
                  <View
                    style={{
                      position: 'absolute',
                      left: x - 6,
                      top: y - 6,
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: Colors.accent,
                      borderWidth: 2,
                      borderColor: Colors.cardBackground,
                      zIndex: 2,
                    }}
                  />
                  {val > 0 && (
                    <View
                      style={{
                        position: 'absolute',
                        left: x - 12,
                        top: y - 24,
                        width: 24,
                        alignItems: 'center',
                        zIndex: 3,
                      }}
                    >
                      <Text style={styles.chartPointValue}>{val}</Text>
                    </View>
                  )}
                </React.Fragment>
              );
            })}
          </View>
          
          {/* X-axis Labels */}
          <View style={[styles.xAxisLabels, { width: chartWidth }]}>
            {weekDays.map((day) => (
              <Text key={day} style={styles.xAxisLabel}>{day}</Text>
            ))}
          </View>
        </View>

        {/* Pie Chart Card */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Appointments Distribution (Pie Chart)</Text>
          <View style={styles.pieChartWrapper}>
            {total > 0 ? (
              <Svg width={140} height={140} style={styles.pieSvg}>
                {pieSlices.map((slice, i) => {
                  if (slice.isFullCircle) {
                    return (
                      <Circle
                        key={i}
                        cx={70}
                        cy={70}
                        r={60}
                        fill={slice.color}
                      />
                    );
                  }
                  return (
                    <Path
                      key={i}
                      d={slice.pathData}
                      fill={slice.color}
                    />
                  );
                })}
              </Svg>
            ) : (
              <Svg width={140} height={140} style={styles.pieSvg}>
                <Circle
                  cx={70}
                  cy={70}
                  r={60}
                  fill="none"
                  stroke={Colors.border}
                  strokeWidth={8}
                />
                <SvgText
                  x="70"
                  y="75"
                  fill={Colors.textSecondary}
                  fontSize="12"
                  textAnchor="middle"
                  fontWeight="600"
                >
                  No Data
                </SvgText>
              </Svg>
            )}
            
            {/* Legend Column */}
            <View style={styles.pieLegend}>
              {total === 0 ? (
                <Text style={styles.noLegendText}>No appointments booked for this week.</Text>
              ) : (
                appointmentsPerDay.map((count, index) => {
                  if (count === 0) return null;
                  return (
                    <View key={index} style={styles.legendRow}>
                      <View style={[styles.legendColorBox, { backgroundColor: colors[index] }]} />
                      <Text style={styles.legendText}>
                        {weekDays[index]}: {count} ({Math.round((count / total) * 100)}%)
                      </Text>
                    </View>
                  );
                })
              )}
            </View>
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
  chartCard: {
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  chartTitle: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  lineChartWrapper: {
    height: 110,
    position: 'relative',
  },
  gridLinesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  gridLine: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    width: '100%',
  },
  chartPointValue: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  xAxisLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginTop: Spacing.sm,
  },
  xAxisLabel: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '500',
  },
  pieChartWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pieSvg: {
    marginRight: Spacing.md,
  },
  pieLegend: {
    flex: 1,
  },
  noLegendText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  legendColorBox: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: Spacing.sm,
  },
  legendText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
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
