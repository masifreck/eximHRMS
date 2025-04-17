import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import MonthPicker from 'react-native-month-year-picker';

const MonthYearPicker = ({ onMonthYearChange }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const handlePickerChange = (event, newDate) => {
    if (event === 'dismissedAction') {
      setShowPicker(false);
      return;
    }

    const currentDate = newDate || selectedDate;
    setShowPicker(Platform.OS === 'ios');
    setSelectedDate(currentDate);

    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    onMonthYearChange?.(month, year);
  };

  const showDatepicker = () => {
    setShowPicker(true);
  };

  const formatDate = (date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.btn} onPress={showDatepicker}>
        <Text style={styles.txt}>
          Select Month & Year
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <MonthPicker
          value={selectedDate}
          onChange={handlePickerChange}
          maximumDate={new Date()} // Prevent future date selection
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },
  btn: {
    width: '75%',
    height: 45,
    backgroundColor: '#aa18ea',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  txt: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MonthYearPicker;
