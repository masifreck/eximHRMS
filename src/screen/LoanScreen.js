import React, {useEffect, useState, useMemo, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

const BASE_URL = 'https://hrexim.tranzol.com/api';

const LoanScreen = () => {
  const [loanData, setLoanData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  //-------------------------------------------------
  // API
  //-------------------------------------------------

  const fetchLoans = async () => {
    try {
      setError('');

      const token = await AsyncStorage.getItem('access_token');
    const details = await AsyncStorage.getItem("employeeDetails");
        if (details !== null) {
          const parsedDetails = JSON.parse(details);
            employeeId = parsedDetails.EmployeeId;
        
          
        }

      if (!token) {
        setError('Authentication failed.');
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${BASE_URL}/Employee/GetLoan?employeeId=${employeeId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.status === 401) {
        throw new Error('Session expired. Please login again.');
      }

      if (!response.ok) {
        throw new Error('Unable to fetch loan details.');
      }

      const json = await response.json();

      if (Array.isArray(json)) {
        setLoanData(json);
      } else {
        setLoanData([]);
      }
    } catch (e) {
      setLoanData([]);
      setError(e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  //-------------------------------------------------

  useEffect(() => {
    fetchLoans();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchLoans();
  }, []);

  //-------------------------------------------------
  // Helpers
  //-------------------------------------------------

  const formatCurrency = amount =>
    `₹${Number(amount).toLocaleString('en-IN')}`;

  const formatDate = date =>
    new Date(date).toLocaleDateString('en-GB');

  //-------------------------------------------------
  // Summary Calculation
  //-------------------------------------------------

  const summary = useMemo(() => {
    const totalLoan = loanData.reduce(
      (sum, item) => sum + Number(item.LoanAmount),
      0,
    );

    const totalPaid = loanData.reduce(
      (sum, item) => sum + Number(item.LoanPaidAmount),
      0,
    );

    const outstanding = totalLoan - totalPaid;

    const totalInstallment = loanData.reduce(
      (sum, item) => sum + Number(item.Installment),
      0,
    );

    const paidPercentage =
      totalLoan === 0
        ? 0
        : ((totalPaid / totalLoan) * 100).toFixed(0);

    return {
      totalLoan,
      totalPaid,
      outstanding,
      totalInstallment,
      paidPercentage,
    };
  }, [loanData]);

  //-------------------------------------------------
  // Dashboard Header
  //-------------------------------------------------

  const Dashboard = () => (
    <LinearGradient
      colors={['#7C3AED', '#4F46E5']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={styles.dashboard}>
      
      <View style={styles.dashboardTop}>

        <View>

          <Text style={styles.dashboardTitle}>
            Loan Summary
          </Text>

          <Text style={styles.dashboardSubtitle}>
            Outstanding Balance
          </Text>

          <Text style={styles.balanceAmount}>
            {formatCurrency(summary.outstanding)}
          </Text>

        </View>

        <View style={styles.walletCircle}>
          <MaterialCommunityIcons
            name="wallet-outline"
            size={40}
            color="#fff"
          />
        </View>

      </View>

      <View style={styles.progressBackground}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${summary.paidPercentage}%`,
            },
          ]}
        />
      </View>

      <Text style={styles.progressLabel}>
        {summary.paidPercentage}% Loan Repaid
      </Text>

      <View style={styles.summaryContainer}>

        <View style={styles.summaryBox}>

          <MaterialCommunityIcons
            name="cash-multiple"
            size={22}
            color="#fff"
          />

          <Text style={styles.summaryValue}>
            {formatCurrency(summary.totalLoan)}
          </Text>

          <Text style={styles.summaryText}>
            Total Loan
          </Text>

        </View>

        <View style={styles.summaryBox}>

          <MaterialCommunityIcons
            name="check-circle-outline"
            size={22}
            color="#4ADE80"
          />

          <Text style={styles.summaryValue}>
            {formatCurrency(summary.totalPaid)}
          </Text>

          <Text style={styles.summaryText}>
            Paid
          </Text>

        </View>

        <View style={styles.summaryBox}>

          <MaterialCommunityIcons
            name="calendar-month"
            size={22}
            color="#FACC15"
          />

          <Text style={styles.summaryValue}>
            {formatCurrency(summary.totalInstallment)}
          </Text>

          <Text style={styles.summaryText}>
            EMI
          </Text>

        </View>

      </View>

    </LinearGradient>
  );

  //-------------------------------------------------
  // Loading
  //-------------------------------------------------

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color="#5B21B6"
        />

        <Text style={styles.loadingText}>
          Loading Loan Details...
        </Text>
      </View>
    );
  }

  //-------------------------------------------------
  // Error
  //-------------------------------------------------

  if (error !== '') {
    return (
      <View style={styles.center}>

        <MaterialCommunityIcons
          name="alert-circle-outline"
          size={70}
          color="#EF4444"
        />

        <Text style={styles.errorText}>
          {error}
        </Text>

        <TouchableOpacity
          style={styles.retryButton}
          onPress={fetchLoans}>

          <Text style={styles.retryText}>
            Retry
          </Text>

        </TouchableOpacity>

      </View>
    );
  }

  //-------------------------------------------------
  // Empty
  //-------------------------------------------------

  if (loanData.length === 0) {
    return (
      <View style={styles.center}>

        <MaterialCommunityIcons
          name="hand-coin-outline"
          size={90}
          color="#9CA3AF"
        />

        <Text style={styles.emptyTitle}>
          No Loan Found
        </Text>

        <Text style={styles.emptySubtitle}>
          There are currently no loan records
          available.
        </Text>

      </View>
    );
  }

  //-------------------------------------------------
  // Continue in Part 2...
    //-------------------------------------------------
  // Pie Chart
  //-------------------------------------------------

  const ChartSection = () => {
    const paid = summary.totalPaid;
    const outstanding = summary.outstanding;

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>Loan Overview</Text>

        {/* If you're using react-native-chart-kit or another chart library,
            replace this placeholder with your chart component.
            The data values are:
            Paid: paid
            Outstanding: outstanding
        */}

        <View style={styles.chartPlaceholder}>
          <MaterialCommunityIcons
            name="chart-pie"
            size={70}
            color="#7C3AED"
          />

          <Text style={styles.chartPlaceholderText}>
            Paid : {formatCurrency(paid)}
          </Text>

          <Text style={styles.chartPlaceholderText}>
            Outstanding : {formatCurrency(outstanding)}
          </Text>
        </View>
      </View>
    );
  };

  //-------------------------------------------------
  // Loan Card
  //-------------------------------------------------

  const renderItem = ({item, index}) => {
    const balance = item.LoanAmount - item.LoanPaidAmount;

    const percentage =
      item.LoanAmount === 0
        ? 0
        : (item.LoanPaidAmount / item.LoanAmount) * 100;

    const completed = balance <= 0;

    return (
      <View style={styles.loanCard}>

        <View style={styles.loanHeader}>

          <View>

            <Text style={styles.loanNumber}>
              Loan #{index + 1}
            </Text>

            <Text style={styles.loanDate}>
              {formatDate(item.GivenDate)}
            </Text>

          </View>

          <View
            style={[
              styles.statusChip,
              {
                backgroundColor: completed
                  ? '#DCFCE7'
                  : '#DBEAFE',
              },
            ]}>

            <Text
              style={[
                styles.statusText,
                {
                  color: completed
                    ? '#15803D'
                    : '#2563EB',
                },
              ]}>
              {completed ? 'Completed' : 'Running'}
            </Text>

          </View>

        </View>

        <Text style={styles.balanceLabel}>
          Outstanding Balance
        </Text>

        <Text style={styles.balanceValue}>
          {formatCurrency(balance)}
        </Text>

        <View style={styles.loanProgressBackground}>
          <View
            style={[
              styles.loanProgressFill,
              {
                width: `${percentage}%`,
              },
            ]}
          />
        </View>

        <Text style={styles.loanProgressText}>
          {percentage.toFixed(0)}% Repaid
        </Text>

        <View style={styles.cardRow}>

          <View style={styles.infoCard}>
            <MaterialCommunityIcons
              name="cash"
              size={22}
              color="#4F46E5"
            />

            <Text style={styles.infoTitle}>
              Loan
            </Text>

            <Text style={styles.infoValue}>
              {formatCurrency(item.LoanAmount)}
            </Text>
          </View>

          <View style={styles.infoCard}>
            <MaterialCommunityIcons
              name="check-circle"
              size={22}
              color="#16A34A"
            />

            <Text style={styles.infoTitle}>
              Paid
            </Text>

            <Text style={styles.infoValue}>
              {formatCurrency(item.LoanPaidAmount)}
            </Text>
          </View>

        </View>

        <View style={styles.cardRow}>

          <View style={styles.infoCard}>
            <MaterialCommunityIcons
              name="calendar-month"
              size={22}
              color="#EA580C"
            />

            <Text style={styles.infoTitle}>
              EMI
            </Text>

            <Text style={styles.infoValue}>
              {formatCurrency(item.Installment)}
            </Text>
          </View>

          <View style={styles.infoCard}>
            <MaterialCommunityIcons
              name="account-circle-outline"
              size={22}
              color="#0284C7"
            />

            <Text style={styles.infoTitle}>
              Employee
            </Text>

            <Text
              numberOfLines={1}
              style={styles.employeeName}>
              {item.FirstName}
            </Text>
          </View>

        </View>

      </View>
    );
  };

  //-------------------------------------------------
  // Main UI
  //-------------------------------------------------

  return (
    <SafeAreaView style={styles.container}>

      <StatusBar
        backgroundColor="#7C3AED"
        barStyle="light-content"
      />

      <FlatList
        data={loanData}
        renderItem={renderItem}
        keyExtractor={(item, index) =>
          index.toString()
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#7C3AED']}
          />
        }
        ListHeaderComponent={
          <>
            <Dashboard />
            <ChartSection />
          </>
        }
      />
    </SafeAreaView>
  );
};

export default LoanScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FB',
  },

  list: {
    paddingBottom: 30,
  },

  //===============================
  // Dashboard
  //===============================

  dashboard: {
    margin: 16,
    borderRadius: 26,
    padding: 22,
    elevation: 10,
    shadowColor: '#5B21B6',
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 10,
    },
  },

  dashboardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  dashboardTitle: {
    fontSize: 16,
    color: '#EDE9FE',
    fontWeight: '600',
  },

  dashboardSubtitle: {
    marginTop: 12,
    color: '#DDD6FE',
    fontSize: 14,
  },

  balanceAmount: {
    marginTop: 8,
    fontSize: 34,
    color: '#FFFFFF',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },

  walletCircle: {
    height: 72,
    width: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  //===============================
  // Progress
  //===============================

  progressBackground: {
    marginTop: 24,
    height: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.20)',
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    borderRadius: 10,
    backgroundColor: '#22C55E',
  },

  progressLabel: {
    marginTop: 10,
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'right',
  },

  //===============================
  // Summary Cards
  //===============================

  summaryContainer: {
    marginTop: 28,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  summaryBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },

  summaryValue: {
    marginTop: 10,
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
    textAlign: 'center',
  },

  summaryText: {
    marginTop: 6,
    color: '#DDD6FE',
    fontSize: 12,
    textAlign: 'center',
  },

  //===============================
  // Chart Section
  //===============================

  chartContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 18,
    borderRadius: 24,
    padding: 20,

    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  sectionTitle: {
    fontSize: 18,
    color: '#1F2937',
    fontWeight: '700',
    marginBottom: 18,
  },

  chartPlaceholder: {
    height: 220,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEF2F7',
  },

  chartPlaceholderText: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: '600',
    color: '#4B5563',
  },
    //===============================
  // Loan Card
  //===============================

  loanCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 18,
    borderRadius: 24,
    padding: 20,

    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  loanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },

  loanNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },

  loanDate: {
    marginTop: 5,
    color: '#6B7280',
    fontSize: 13,
  },

  //===============================
  // Status
  //===============================

  statusChip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statusText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  //===============================
  // Balance
  //===============================

  balanceLabel: {
    color: '#6B7280',
    fontSize: 13,
    marginBottom: 5,
  },

  balanceValue: {
    fontSize: 30,
    fontWeight: '800',
    color: '#DC2626',
    marginBottom: 18,
  },

  //===============================
  // Progress Bar
  //===============================

  loanProgressBackground: {
    height: 10,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },

  loanProgressFill: {
    height: '100%',
    borderRadius: 20,
    backgroundColor: '#22C55E',
  },

  loanProgressText: {
    marginTop: 10,
    alignSelf: 'flex-end',
    color: '#16A34A',
    fontSize: 13,
    fontWeight: '700',
  },

  //===============================
  // Card Rows
  //===============================

  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },

  //===============================
  // Info Cards
  //===============================

  infoCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    marginHorizontal: 5,
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 10,
    alignItems: 'center',

    borderWidth: 1,
    borderColor: '#EEF2F7',
  },

  infoTitle: {
    marginTop: 10,
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '500',
  },

  infoValue: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },

  employeeName: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },

  //===============================
  // Small Financial Badge
  //===============================

  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 14,
  },

  badgeText: {
    marginLeft: 6,
    color: '#4F46E5',
    fontWeight: '700',
    fontSize: 12,
  },

  //===============================
  // Divider
  //===============================

  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 18,
  },

  //===============================
  // Optional Bottom Row
  //===============================

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },

  bottomLabel: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '500',
  },

  bottomValue: {
    color: '#0F172A',
    fontWeight: '700',
    fontSize: 15,
  },
    //=====================================
  // Center Screen
  //=====================================

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F7FB',
    paddingHorizontal: 25,
  },

  loadingText: {
    marginTop: 18,
    fontSize: 16,
    color: '#64748B',
    fontWeight: '600',
  },

  //=====================================
  // Retry Button
  //=====================================

  retryButton: {
    marginTop: 30,
    backgroundColor: '#7C3AED',
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 30,

    elevation: 6,
    shadowColor: '#7C3AED',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },
  },

  retryText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.5,
  },

  //=====================================
  // Error
  //=====================================

  errorText: {
    marginTop: 18,
    color: '#DC2626',
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 24,
  },

  //=====================================
  // Empty State
  //=====================================

  emptyTitle: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
  },

  emptySubtitle: {
    marginTop: 10,
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 15,
    lineHeight: 22,
    paddingHorizontal: 20,
  },

  //=====================================
  // Generic Text
  //=====================================

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },

  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#6B7280',
  },

  //=====================================
  // Card Shadow Helper
  //=====================================

  shadow: {
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 5,
    },
  },

  //=====================================
  // Spacing Helpers
  //=====================================

  mt10: {
    marginTop: 10,
  },

  mt20: {
    marginTop: 20,
  },

  mb10: {
    marginBottom: 10,
  },

  mb20: {
    marginBottom: 20,
  },

  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});