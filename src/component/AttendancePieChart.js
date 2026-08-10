import React, {useMemo} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {PieChart} from 'react-native-gifted-charts';

const leaveTypeMap = {
  CL: {
    label: 'Casual Leave',
    icon: 'umbrella-beach',
  },
  SL: {
    label: 'Sick Leave',
    icon: 'hospital',
  },
  EL: {
    label: 'Earned Leave',
    icon: 'calendar-check',
  },
  ML: {
    label: 'Maternity Leave',
    icon: 'baby-face-outline',
  },
  PAT: {
    label: 'Paternity Leave',
    icon: 'baby-carriage',
  },
  MAL: {
    label: 'Marriage Leave',
    icon: 'ring',
  },
  COL: {
    label: 'Compensatory Leave',
    icon: 'calendar-clock',
  },
  LOP: {
    label: 'Loss of Pay',
    icon: 'currency-usd-off',
  },
  OD: {
    label: 'On Duty',
    icon: 'briefcase-account',
  },
  WO: {
    label: 'Weekly Off',
    icon: 'calendar-weekend',
  },
  SPL: {
    label: 'Special Leave',
    icon: 'star-circle',
  },
  HF: {
    label: 'Half Day',
    icon: 'weather-sunset',
    iconcolor: '#ffd700',
  },
  NH: {
    label: 'National Holiday',
    icon: 'flag-variant',
  },
  AB: {
    label: 'Absent',
    icon: 'account-off',
    iconcolor: 'red',
  },
  FD: {
    label: 'Full Day',
    icon: 'briefcase-account',
    iconcolor: 'green',
  },
};

const AttendancePieChart = ({attendanceData = []}) => {
  const {pieData, attendanceSummary, totalDays} = useMemo(() => {
    const count = {};

    attendanceData.forEach(item => {
      const type = item?.Test;

      if (type) {
        count[type] = (count[type] || 0) + 1;
      }
    });

    const summary = Object.entries(count).map(([type, value]) => ({
      type,
      value,
      label: leaveTypeMap[type]?.label || type,
    }));

    const total = attendanceData.length;

    const data = summary.map(item => ({
      value: item.value,
      text: `${item.value}`,
      color: getColor(item.type),
      focused: false,
    }));

    return {
      pieData: data,
      attendanceSummary: summary,
      totalDays: total,
    };
  }, [attendanceData]);

  function getColor(type) {
    const colors = {
      FD: '#22c55e',
      WO: '#6366f1',
      NH: '#f59e0b',
      AB: '#ef4444',
      HF: '#ffd700',
      CL: '#06b6d4',
      SL: '#ec4899',
      EL: '#8b5cf6',
      ML: '#f97316',
      PAT: '#14b8a6',
      MAL: '#e11d48',
      COL: '#0ea5e9',
      LOP: '#dc2626',
      OD: '#84cc16',
      SPL: '#a855f7',
    };

    return colors[type] || '#94a3b8';
  }

  if (!attendanceData || attendanceData.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No attendance data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Attendance Summary</Text>
          <Text style={styles.subtitle}>
            Month-wise attendance overview
          </Text>
        </View>

        <View style={styles.totalContainer}>
          <Text style={styles.totalNumber}>{totalDays}</Text>
          <Text style={styles.totalText}>Days</Text>
        </View>
      </View>

      {/* Pie Chart */}
      <View style={styles.chartContainer}>
        <PieChart
          data={pieData}
          donut
          radius={105}
          innerRadius={65}
          innerCircleColor="#ffffff"
          centerLabelComponent={() => (
            <View style={styles.centerLabel}>
              <Text style={styles.centerNumber}>{totalDays}</Text>
              <Text style={styles.centerText}>Total Days</Text>
            </View>
          )}
          showText
          textColor="#ffffff"
          textSize={13}
          fontWeight="bold"
          strokeColor="#ffffff"
          strokeWidth={2}
        />
      </View>

      {/* Legend */}
      <View style={styles.legendContainer}>
        {attendanceSummary.map(item => {
          const percentage =
            totalDays > 0
              ? ((item.value / totalDays) * 100).toFixed(1)
              : 0;

          return (
            <View style={styles.legendItem} key={item.type}>
              <View
                style={[
                  styles.colorDot,
                  {
                    backgroundColor: getColor(item.type),
                  },
                ]}
              />

              <View style={styles.legendInfo}>
                <Text style={styles.legendLabel}>
                  {item.label}
                </Text>

                <Text style={styles.legendCode}>
                  {item.type}
                </Text>
              </View>

              <View style={styles.legendCountContainer}>
                <Text style={styles.legendCount}>
                  {item.value}
                </Text>

                <Text style={styles.legendPercentage}>
                  {percentage}%
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    marginHorizontal: 12,
    marginVertical: 10,
    borderRadius: 18,
    padding: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
  },

  subtitle: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 3,
  },

  totalContainer: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    alignItems: 'center',
  },

  totalNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#3e0961',
  },

  totalText: {
    fontSize: 9,
    color: '#64748b',
  },

  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },

  centerLabel: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  centerNumber: {
    fontSize: 25,
    fontWeight: '800',
    color: '#1e293b',
  },

  centerText: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 2,
  },

  legendContainer: {
    marginTop: 5,
  },

  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },

  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },

  legendInfo: {
    flex: 1,
  },

  legendLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },

  legendCode: {
    fontSize: 9,
    color: '#94a3b8',
    marginTop: 1,
  },

  legendCountContainer: {
    alignItems: 'flex-end',
  },

  legendCount: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1e293b',
  },

  legendPercentage: {
    fontSize: 9,
    color: '#64748b',
    marginTop: 1,
  },

  emptyContainer: {
    margin: 12,
    padding: 30,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    alignItems: 'center',
    elevation: 3,
  },

  emptyText: {
    color: '#64748b',
    fontSize: 13,
  },
});

export default AttendancePieChart;