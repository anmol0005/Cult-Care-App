import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography, BorderRadius } from '../theme';

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.75;

interface SidebarLayoutProps {
  children: React.ReactNode;
  navigation: any;
  title: string;
}

export const SidebarLayout: React.FC<SidebarLayoutProps> = ({
  children,
  navigation,
  title,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const openSidebar = () => {
    setIsOpen(true);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeSidebar = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -SIDEBAR_WIDTH,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsOpen(false);
    });
  };

  const navigateTo = (screenName: string) => {
    closeSidebar();
    if (screenName === 'Login') {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } else {
      // Ensure we navigate to stack screen correctly
      navigation.navigate(screenName);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      
      {/* Screen Header */}
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.headerSafeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={openSidebar}
            activeOpacity={0.7}
          >
            <View style={styles.hamburgerLine} />
            <View style={[styles.hamburgerLine, { marginVertical: 4 }]} />
            <View style={styles.hamburgerLine} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{title}</Text>
          <View style={styles.headerRightPlaceholder} />
        </View>
      </SafeAreaView>

      {/* Screen Body */}
      <View style={styles.content}>
        {children}
      </View>

      {/* Sidebar Overlay and Drawer */}
      {isOpen && (
        <View style={StyleSheet.absoluteFill}>
          {/* Backdrop */}
          <TouchableWithoutFeedback onPress={closeSidebar}>
            <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]} />
          </TouchableWithoutFeedback>

          {/* Sidebar Panel */}
          <Animated.View
            style={[
              styles.sidebar,
              { transform: [{ translateX: slideAnim }] },
            ]}
          >
            <SafeAreaView style={styles.sidebarContent} edges={['top', 'bottom', 'left']}>
              {/* App Brand Header */}
              <View style={styles.brandContainer}>
                <Text style={styles.brandText}>CultCare</Text>
                <Text style={styles.brandSubtext}>Healthcare Companion</Text>
              </View>

              {/* Navigation Items */}
              <View style={styles.navContainer}>
                <TouchableOpacity
                  style={[styles.navItem, title === 'Dashboard' && styles.navItemActive]}
                  onPress={() => navigateTo('Dashboard')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.navIcon}>📊</Text>
                  <Text style={[styles.navItemText, title === 'Dashboard' && styles.navItemTextActive]}>
                    Dashboard
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.navItem, title === 'Enter Patient' && styles.navItemActive]}
                  onPress={() => navigateTo('EnterPatient')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.navIcon}>👤</Text>
                  <Text style={[styles.navItemText, title === 'Enter Patient' && styles.navItemTextActive]}>
                    Patinet
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.navItem, title === 'Make Appointment' && styles.navItemActive]}
                  onPress={() => navigateTo('MakeAppointment')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.navIcon}>📅</Text>
                  <Text style={[styles.navItemText, title === 'Make Appointment' && styles.navItemTextActive]}>
                    Make Appointment
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Logout Button at bottom */}
              <View style={styles.footerContainer}>
                <TouchableOpacity
                  style={styles.logoutButton}
                  onPress={() => navigateTo('Login')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.logoutIcon}>🚪</Text>
                  <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </Animated.View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerSafeArea: {
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
  },
  menuButton: {
    padding: Spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
  },
  hamburgerLine: {
    width: 22,
    height: 2,
    backgroundColor: Colors.text,
    borderRadius: 1,
  },
  headerTitle: {
    ...Typography.subheader,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  headerRightPlaceholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: Colors.cardBackground,
    borderRightWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  sidebarContent: {
    flex: 1,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  brandContainer: {
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.sm,
  },
  brandText: {
    ...Typography.header,
    fontSize: 24,
    color: Colors.primaryLight,
  },
  brandSubtext: {
    ...Typography.caption,
    marginTop: 2,
  },
  navContainer: {
    flex: 1,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.xs,
  },
  navItemActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
  },
  navIcon: {
    fontSize: 18,
    marginRight: Spacing.md,
  },
  navItemText: {
    ...Typography.body,
    fontSize: 15,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  navItemTextActive: {
    color: Colors.primaryLight,
    fontWeight: '700',
  },
  footerContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.md,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  logoutIcon: {
    fontSize: 18,
    marginRight: Spacing.md,
  },
  logoutText: {
    ...Typography.body,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.error,
  },
});
