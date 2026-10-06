import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const deviceWidth = Dimensions.get('window').width;

const HomeCrads = () => {
  return (
    <View style={styles.container}>

      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>
            Quick Access
          </Text>

          <Text style={styles.sectionSubtitle}>
            Manage your employee services
          </Text>
        </View>

        <View style={styles.sectionIcon}>
          <Ionicons
            name="grid-outline"
            size={18}
            color="#2563EB"
          />
        </View>
      </View>

      {/* Row 1 */}
      <View style={styles.row}>
        <Card
          image={require('../assets/atthhome.png')}
          label="Attendance History"
          NavigationValue="AttnHistory"
        />

        <Card
          image={require('../assets/profile2home.webp')}
          label="My Profile"
          NavigationValue="EProfile"
        />
      </View>

      {/* Row 2 */}
      <View style={styles.row}>
        <Card
          image={require('../assets/leavehome.webp')}
          label="Leave"
          NavigationValue="Leave"
        />

        <Card
          image={require('../assets/newleavehome.png')}
          label="Apply Leave"
          NavigationValue="NewLeave"
        />
      </View>

      {/* Row 3 */}
      <View style={styles.row}>
        <Card
          image={require('../assets/reimbursementhome.png')}
          label="Reimbursement"
          NavigationValue="Reimbursement"
        />

        <Card
          image={require('../assets/newreimbursementhome.png')}
          label="Apply Reimbursement"
          NavigationValue="NewReimbursementRequest"
        />
      </View>

      {/* Row 4 */}
      <View style={styles.row}>
        <Card
          image={require('../assets/loan.png')}
          label="My Loans"
          NavigationValue="loan"
        />

        <Card
          image={require('../assets/salaryhome.png')}
          label="Salary Slip"
          NavigationValue="Salaryslip"
        />
      </View>

      {/* Row 5 */}
      <View style={styles.row}>
        <Card
          image={require('../assets/holidayhome2.png')}
          label="My Holidays"
          NavigationValue="holidays"
        />

        <Card
          image={require('../assets/help-desk.png')}
          label="Help Desk"
          NavigationValue="HelpDeskList"
        />
      </View>

    </View>
  );
};

const Card = ({
  image,
  label,
  NavigationValue,
}) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      style={styles.card}
      onPress={() => {
        if (NavigationValue) {
          navigation.navigate(NavigationValue);
        }
      }}
    >

      {/* Image Container */}
      <View style={styles.imageContainer}>
        <Image
          source={image}
          style={styles.image}
        />
      </View>

      {/* Card Content */}
      <View style={styles.cardBottom}>
        <Text
          style={styles.label}
          numberOfLines={2}
        >
          {label}
        </Text>

        <View style={styles.arrowButton}>
          <Ionicons
            name="arrow-forward"
            size={14}
            color="#2563EB"
          />
        </View>
      </View>

    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: deviceWidth,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
    backgroundColor: '#F8FAFC',
  },

  // =========================
  // SECTION HEADER
  // =========================

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    paddingHorizontal: 2,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.3,
  },

  sectionSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 3,
  },

  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },

  // =========================
  // ROW
  // =========================

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  // =========================
  // CARD
  // =========================

  card: {
    width: (deviceWidth - 44) / 2,
    minHeight: 145,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,

    borderWidth: 1,
    borderColor: '#E8EEF5',

    shadowColor: '#0F172A',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,

    elevation: 2,
  },

  // =========================
  // IMAGE
  // =========================

  imageContainer: {
    width: '100%',
    height: 88,
    borderRadius: 13,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  image: {
    width: 72,
    height: 72,
    resizeMode: 'contain',
  },

  // =========================
  // BOTTOM
  // =========================

  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  label: {
    flex: 1,
    color: '#1E293B',
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '600',
    paddingRight: 5,
  },

  arrowButton: {
    width: 27,
    height: 27,
    borderRadius: 9,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeCrads;