import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  PermissionsAndroid,
  Alert,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  Image,
} from 'react-native';

import Header from '../component/Header';
import PunchBtn from '../component/PunchBtn';
import HomeCrads from '../component/HomeCrads';

import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PRIMARY = '#8B1FD1';
const PRIMARY_DARK = '#7415B3';
const PRIMARY_LIGHT = '#F5EAFE';

const TEXT_DARK = '#172033';
const TEXT = '#334155';
const TEXT_MUTED = '#64748B';
const BORDER = '#E8EAF0';
const BG = '#F7F8FC';
const WHITE = '#FFFFFF';

const Home = ({ route }) => {
  const navigation = useNavigation();

  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [employeeLoading, setEmployeeLoading] = useState(true);

  const [employeePhoto, setEmployeePhoto] = useState(null);
  const [photoLoading, setPhotoLoading] = useState(false);

  const [lastActionData, setLastActionData] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [isScrolling, setIsScrolling] = useState(false);

  // =========================================================
  // GET EMPLOYEE DETAILS FROM ASYNC STORAGE
  // =========================================================

  const getEmployeeDetails = async () => {
    try {
      setEmployeeLoading(true);

      const details =
        await AsyncStorage.getItem('employeeDetails');

      if (details) {
        const parsedDetails = JSON.parse(details);

        setEmployeeDetails(parsedDetails);

        console.log(
          'Parsed Employee Details:',
          parsedDetails,
        );
      } else {
        setEmployeeDetails(null);
      }
    } catch (error) {
      console.error(
        'Error retrieving Employee Details:',
        error,
      );

      setEmployeeDetails(null);
    } finally {
      setEmployeeLoading(false);
    }
  };

  // =========================================================
  // GET EMPLOYEE PHOTO FROM API
  // =========================================================

  const getPhoto = async () => {
    try {
      setPhotoLoading(true);

      const mobileNo =
        await AsyncStorage.getItem('mobileNo');

      const token =
        await AsyncStorage.getItem('access_token');

      if (!mobileNo || !token) {
        console.log(
          'Mobile number or token missing',
        );
        return;
      }

      const url =
        `https://hrexim.tranzol.com/api/Employee/GetEmployee?mobileno=${mobileNo}`;

      console.log('Employee Photo API:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(
          `Invalid response: ${response.status}`,
        );
      }

      const photoResponse = await response.json();

      console.log(
        'Employee Photo Response:',
        photoResponse,
      );

      if (photoResponse?.Photo) {
        setEmployeePhoto(photoResponse.Photo);
      } else {
        setEmployeePhoto(null);
      }
    } catch (error) {
      console.error(
        'Error fetching employee photo:',
        error,
      );

      setEmployeePhoto(null);
    } finally {
      setPhotoLoading(false);
    }
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = date => {
    if (!date) {
      return '-';
    }

    try {
      const parsedDate = new Date(date);

      if (isNaN(parsedDate.getTime())) {
        return '-';
      }

      return parsedDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch (error) {
      return '-';
    }
  };

  // =========================================================
  // GET EMPLOYEE INITIALS
  // =========================================================

  const getInitials = () => {
    if (!employeeDetails) {
      return 'U';
    }

    const name =
      employeeDetails.FirstName ||
      employeeDetails.AccountName ||
      'User';

    const words = name.trim().split(' ');

    if (words.length >= 2) {
      return (
        words[0].charAt(0) +
        words[words.length - 1].charAt(0)
      ).toUpperCase();
    }

    return name.substring(0, 2).toUpperCase();
  };

  // =========================================================
  // REFRESH LAST ATTENDANCE ACTION
  // =========================================================

  const RefreshLastAction = async () => {
    try {
      setIsLoading(true);

      const data =
        await AsyncStorage.getItem('lastPunchIn');

      if (data) {
        const separatorIndex =
          data.indexOf(': ');

        if (separatorIndex !== -1) {
          const actionType =
            data.substring(0, separatorIndex);

          const dateTime =
            data.substring(separatorIndex + 2);

          const parsedDate =
            new Date(dateTime);

          if (!isNaN(parsedDate.getTime())) {
            const formattedDateTime =
              parsedDate.toLocaleString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              });

            setLastActionData(
              `${actionType} • ${formattedDateTime}`,
            );
          } else {
            setLastActionData(data);
          }
        } else {
          setLastActionData(data);
        }
      } else {
        setLastActionData('');
      }
    } catch (error) {
      console.error(
        'Error fetching last punch data:',
        error,
      );

      setLastActionData('');
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================
  // LOCATION PERMISSION
  // =========================================================

  const requestLocationPermission = async () => {
    try {
      const granted =
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS
            .ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message:
              'Location access is required for attendance punching.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

      console.log(
        'Location permission:',
        granted,
      );

      if (granted !== 'granted') {
        Alert.alert(
          'Location Permission Required',
          'Please allow location access to use attendance punching.',
          [
            {
              text: 'OK',
            },
          ],
        );
      }
    } catch (error) {
      console.log(
        'Location permission error:',
        error,
      );
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    getEmployeeDetails();
    getPhoto();
    RefreshLastAction();
    requestLocationPermission();
  }, []);

  // =========================================================
  // REFRESH WHEN RETURNING TO HOME
  // =========================================================

  useEffect(() => {
    if (route?.params?.lastPunchIn) {
      setLastActionData(
        route.params.lastPunchIn,
      );
    }
  }, [route?.params?.lastPunchIn]);

  // =========================================================
  // SCROLL
  // =========================================================

  const handleScroll = event => {
    const offsetY =
      event.nativeEvent.contentOffset.y;

    setIsScrolling(offsetY > 5);
  };

  // =========================================================
  // EMPLOYEE DATA
  // =========================================================

  const employeeName =
    employeeDetails?.FirstName ||
    employeeDetails?.AccountName ||
    'Employee';

  const employeeCode =
    employeeDetails?.EmployeeCode ||
    'Employee';

  const designation =
    employeeDetails?.Designation || '-';

  const department =
    employeeDetails?.Department || '-';

  const branch =
    employeeDetails?.BranchName || '-';

  const division =
    employeeDetails?.Division || '-';

  const joiningDate = formatDate(
    employeeDetails?.JoiningDate,
  );

  // =========================================================
  // PHOTO URL
  // =========================================================

 const photoUrl = employeePhoto
  ? employeePhoto.startsWith('http')
    ? employeePhoto
    : `https://hrexim.tranzol.com/${employeePhoto.replace(/^\/+/, '')}`
  : null;

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={PRIMARY_LIGHT}
      />

      {/* ================================================= */}
      {/* TOP SECTION */}
      {/* ================================================= */}

      <View style={styles.topSection}>
        <Header />

        {/* ================================================= */}
        {/* EMPLOYEE CARD */}
        {/* ================================================= */}

        <View style={styles.employeeCard}>
          {employeeLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator
                size="small"
                color={PRIMARY}
              />

              <Text style={styles.loadingText}>
                Loading profile...
              </Text>
            </View>
          ) : employeeDetails ? (
            <>
              {/* PROFILE TOP */}

              <View style={styles.profileTop}>
                {/* PHOTO */}

                <View style={styles.avatar}>
                  {photoLoading ? (
                    <ActivityIndicator
                      size="small"
                      color={WHITE}
                    />
                  ) : photoUrl ? (
                    <Image
                      source={{
                        uri: photoUrl,
                      }}
                      style={styles.avatarImage}
                      resizeMode="cover"
                      onError={() => {
                        console.log(
                          'Employee image failed:',
                          photoUrl,
                        );

                        setEmployeePhoto(null);
                      }}
                    />
                  ) : (
                    <Text
                      style={styles.avatarText}
                    >
                      {getInitials()}
                    </Text>
                  )}
                </View>

                {/* NAME */}

                <View style={styles.profileInfo}>
                  <Text
                    style={styles.employeeName}
                    numberOfLines={1}
                  >
                    {employeeDetails?.Salutation
                      ? `${employeeDetails.Salutation} `
                      : ''}
                    {employeeName}
                  </Text>

                  <Text
                    style={styles.employeeCode}
                    numberOfLines={1}
                  >
                    {employeeCode}
                  </Text>

                  <View style={styles.activeRow}>
                    <View
                      style={styles.activeDot}
                    />

                    <Text style={styles.activeText}>
                      Active Employee
                    </Text>
                  </View>
                </View>

                {/* PROFILE ARROW */}

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() =>
                    navigation.navigate(
                      'Profile',
                    )
                  }
                  style={styles.profileArrow}
                >
                  <AntDesign
                    name="right"
                    size={14}
                    color={PRIMARY}
                  />
                </TouchableOpacity>
              </View>

              {/* ================================================= */}
              {/* DESIGNATION */}
              {/* ================================================= */}

              <View style={styles.designationBox}>
                <View
                  style={styles.designationIcon}
                >
                  <AntDesign
                    name="idcard"
                    size={15}
                    color={PRIMARY}
                  />
                </View>

                <View
                  style={
                    styles.designationContent
                  }
                >
                  <Text
                    style={styles.smallLabel}
                  >
                    DESIGNATION
                  </Text>

                  <Text
                    style={styles.designationText}
                    numberOfLines={2}
                  >
                    {designation}
                  </Text>
                </View>
              </View>

              {/* ================================================= */}
              {/* DETAILS */}
              {/* ================================================= */}

              <View style={styles.detailsGrid}>
                {/* DEPARTMENT */}

                <View style={styles.detailItem}>
                  <View
                    style={styles.detailIcon}
                  >
                    <AntDesign
                      name="appstore-o"
                      size={13}
                      color={PRIMARY}
                    />
                  </View>

                  <View
                    style={styles.detailContent}
                  >
                    <Text
                      style={styles.smallLabel}
                    >
                      DEPARTMENT
                    </Text>

                    <Text
                      style={styles.detailValue}
                      numberOfLines={1}
                    >
                      {department}
                    </Text>
                  </View>
                </View>

                {/* BRANCH */}

                <View style={styles.detailItem}>
                  <View
                    style={[
                      styles.detailIcon,
                      styles.branchIcon,
                    ]}
                  >
                    {/* Use environment icon */}
                    <AntDesign
                      name="pushpino"
                      size={13}
                      color={PRIMARY}
                    />
                  </View>

                  <View
                    style={styles.detailContent}
                  >
                    <Text
                      style={styles.smallLabel}
                    >
                      BRANCH
                    </Text>

                    <Text
                      style={styles.detailValue}
                      numberOfLines={1}
                    >
                      {branch}
                    </Text>
                  </View>
                </View>

                {/* DIVISION */}

                <View style={styles.detailItem}>
                  <View
                    style={[
                      styles.detailIcon,
                      styles.divisionIcon,
                    ]}
                  >
                    <AntDesign
                      name="bars"
                      size={13}
                      color={PRIMARY}
                    />
                  </View>

                  <View
                    style={styles.detailContent}
                  >
                    <Text
                      style={styles.smallLabel}
                    >
                      DIVISION
                    </Text>

                    <Text
                      style={styles.detailValue}
                      numberOfLines={1}
                    >
                      {division}
                    </Text>
                  </View>
                </View>

                {/* JOINING DATE */}

                <View style={styles.detailItem}>
                  <View
                    style={styles.detailIcon}
                  >
                    <AntDesign
                      name="calendar"
                      size={13}
                      color={PRIMARY}
                    />
                  </View>

                  <View
                    style={styles.detailContent}
                  >
                    <Text
                      style={styles.smallLabel}
                    >
                      JOINED
                    </Text>

                    <Text
                      style={styles.detailValue}
                      numberOfLines={1}
                    >
                      {joiningDate}
                    </Text>
                  </View>
                </View>
              </View>

         

    
            </>
          ) : (
            <View style={styles.noEmployee}>
              <View
                style={styles.noEmployeeIcon}
              >
                <AntDesign
                  name="user"
                  size={22}
                  color="#94A3B8"
                />
              </View>

              <Text
                style={styles.noEmployeeTitle}
              >
                Profile unavailable
              </Text>

              <Text style={styles.noEmployeeText}>
                Employee details could not be
                loaded.
              </Text>

              <TouchableOpacity
                onPress={getEmployeeDetails}
                style={styles.retryButton}
              >
                <Text style={styles.retryText}>
                  Try Again
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* ================================================= */}
        {/* ATTENDANCE CARD */}
        {/* ================================================= */}

        <View style={styles.attendanceCard}>
          <View style={styles.attendanceHeader}>
            <View
              style={styles.attendanceTitleRow}
            >
              <View
                style={styles.attendanceIcon}
              >
                <AntDesign
                  name="clockcircleo"
                  size={16}
                  color={PRIMARY}
                />
              </View>

              <View>
                <Text
                  style={styles.attendanceTitle}
                >
                  Attendance Activity
                </Text>

                <Text
                  style={
                    styles.attendanceSubtitle
                  }
                >
                  Your latest punch activity
                </Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={RefreshLastAction}
              style={styles.refreshButton}
            >
              {isLoading ? (
                <ActivityIndicator
                  size="small"
                  color={PRIMARY}
                />
              ) : (
                <AntDesign
                  name="reload1"
                  size={15}
                  color={PRIMARY}
                />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {isLoading ? (
            <View style={styles.activityLoading}>
              <ActivityIndicator
                size="small"
                color={PRIMARY}
              />

              <Text style={styles.updatingText}>
                Updating attendance...
              </Text>
            </View>
          ) : lastActionData ? (
            <View style={styles.lastActivity}>
              <View style={styles.successIcon}>
                <AntDesign
                  name="check"
                  size={14}
                  color="#16A34A"
                />
              </View>

              <View
                style={
                  styles.lastActivityContent
                }
              >
                <Text
                  style={styles.lastActivityLabel}
                >
                  LAST ACTION
                </Text>

                <Text
                  style={styles.lastActivityText}
                  numberOfLines={2}
                >
                  {lastActionData}
                </Text>
              </View>

              <View
                style={styles.completedBadge}
              >
                <Text
                  style={styles.completedText}
                >
                  Recorded
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.noActivity}>
              <View
                style={styles.noActivityIcon}
              >
                <AntDesign
                  name="clockcircleo"
                  size={15}
                  color="#94A3B8"
                />
              </View>

              <View>
                <Text
                  style={styles.noActivityTitle}
                >
                  No recent activity
                </Text>

                <Text
                  style={styles.noActivityText}
                >
                  Your latest attendance action
                  will appear here.
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* ================================================= */}
      {/* MAIN CONTENT */}
      {/* ================================================= */}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={
          styles.scrollContent
        }
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionHeader}>
      

          <View
            style={styles.sectionIndicator}
          >
            <View
              style={
                styles.sectionIndicatorActive
              }
            />

            <View
              style={
                styles.sectionIndicatorInactive
              }
            />

            <View
              style={
                styles.sectionIndicatorInactive
              }
            />
          </View>
        </View>

        <HomeCrads />

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ================================================= */}
      {/* PUNCH BUTTON */}
      {/* ================================================= */}

      <PunchBtn
        isScrolliing={isScrolling}
      />
    </View>
  );
};

export default Home;

// =========================================================
// STYLES
// =========================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },

  topSection: {
    backgroundColor: PRIMARY_LIGHT,

    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,

    paddingBottom: 8,

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.08,
    shadowRadius: 8,

    elevation: 5,
  },

  // =======================================================
  // EMPLOYEE CARD
  // =======================================================

  employeeCard: {
    marginHorizontal: 15,
    marginTop: 6,

    padding: 14,

    backgroundColor: WHITE,

    borderRadius: 20,

    borderWidth: 1,
    borderColor: '#EEE7F4',

    shadowColor: '#251132',

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.07,
    shadowRadius: 9,

    elevation: 3,
  },

  loadingContainer: {
    minHeight: 100,

    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    marginTop: 8,

    fontSize: 11,

    color: TEXT_MUTED,
  },

  // =======================================================
  // PROFILE
  // =======================================================

  profileTop: {
    flexDirection: 'row',

    alignItems: 'center',
  },

  avatar: {
    width: 58,
    height: 58,

    borderRadius: 18,

    backgroundColor: PRIMARY,

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 12,

    overflow: 'hidden',

    shadowColor: PRIMARY,

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.22,
    shadowRadius: 7,

    elevation: 4,
  },

  avatarImage: {
    width: '100%',
    height: '100%',
  },

  avatarText: {
    color: WHITE,

    fontSize: 19,

    fontWeight: '800',

    letterSpacing: 0.5,
  },

  profileInfo: {
    flex: 1,
  },

  employeeName: {
    fontSize: 17,

    fontWeight: '800',

    color: TEXT_DARK,

    letterSpacing: -0.2,
  },

  employeeCode: {
    marginTop: 3,

    fontSize: 11,

    color: TEXT_MUTED,

    fontWeight: '500',
  },

  activeRow: {
    flexDirection: 'row',

    alignItems: 'center',

    marginTop: 6,
  },

  activeDot: {
    width: 7,
    height: 7,

    borderRadius: 4,

    backgroundColor: '#22C55E',

    marginRight: 5,
  },

  activeText: {
    fontSize: 10,

    color: '#16A34A',

    fontWeight: '700',
  },

  profileArrow: {
    width: 32,
    height: 32,

    borderRadius: 10,

    backgroundColor: PRIMARY_LIGHT,

    alignItems: 'center',
    justifyContent: 'center',

    marginLeft: 8,
  },

  // =======================================================
  // DESIGNATION
  // =======================================================

  designationBox: {
    flexDirection: 'row',

    alignItems: 'center',

    marginTop: 14,

    padding: 10,

    borderRadius: 13,

    backgroundColor: '#FAF8FC',

    borderWidth: 1,

    borderColor: '#F0EAF5',
  },

  designationIcon: {
    width: 31,
    height: 31,

    borderRadius: 9,

    backgroundColor: PRIMARY_LIGHT,

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 9,
  },

  designationContent: {
    flex: 1,
  },

  smallLabel: {
    fontSize: 8.5,

    color: '#94A3B8',

    fontWeight: '700',

    letterSpacing: 0.4,
  },

  designationText: {
    marginTop: 2,

    fontSize: 11.5,

    color: TEXT,

    fontWeight: '700',
  },

  // =======================================================
  // DETAILS
  // =======================================================

  detailsGrid: {
    flexDirection: 'row',

    flexWrap: 'wrap',

    marginTop: 10,

    marginHorizontal: -3,
  },

  detailItem: {
    width: '50%',

    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: 3,

    marginBottom: 7,
  },

  detailIcon: {
    width: 28,
    height: 28,

    borderRadius: 8,

    backgroundColor: '#FAF8FC',

    borderWidth: 1,

    borderColor: '#F0EAF5',

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 7,
  },

  branchIcon: {
    backgroundColor: '#F5EAFE',
  },

  divisionIcon: {
    backgroundColor: '#F5EAFE',
  },

  detailContent: {
    flex: 1,
  },

  detailValue: {
    marginTop: 2,

    fontSize: 10.5,

    color: TEXT,

    fontWeight: '700',
  },

  // =======================================================
  // PROFILE BUTTON
  // =======================================================

  viewProfileButton: {
    height: 39,

    marginTop: 5,

    borderRadius: 11,

    backgroundColor: PRIMARY,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    gap: 7,

    shadowColor: PRIMARY,

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.2,

    shadowRadius: 5,

    elevation: 3,
  },

  viewProfileText: {
    color: WHITE,

    fontSize: 11.5,

    fontWeight: '700',
  },

  // =======================================================
  // NO EMPLOYEE
  // =======================================================

  noEmployee: {
    alignItems: 'center',

    paddingVertical: 15,
  },

  noEmployeeIcon: {
    width: 45,
    height: 45,

    borderRadius: 14,

    backgroundColor: '#F1F5F9',

    alignItems: 'center',
    justifyContent: 'center',
  },

  noEmployeeTitle: {
    marginTop: 8,

    fontSize: 13,

    color: TEXT,

    fontWeight: '700',
  },

  noEmployeeText: {
    marginTop: 3,

    fontSize: 10,

    color: TEXT_MUTED,
  },

  retryButton: {
    marginTop: 10,

    paddingHorizontal: 16,

    paddingVertical: 7,

    borderRadius: 8,

    backgroundColor: PRIMARY_LIGHT,
  },

  retryText: {
    fontSize: 10,

    color: PRIMARY,

    fontWeight: '700',
  },

  // =======================================================
  // ATTENDANCE
  // =======================================================

  attendanceCard: {
    marginHorizontal: 15,

    marginTop: 9,

    marginBottom: 3,

    paddingHorizontal: 13,

    paddingVertical: 12,

    backgroundColor: WHITE,

    borderRadius: 17,

    borderWidth: 1,

    borderColor: BORDER,

    shadowColor: '#0F172A',

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.045,

    shadowRadius: 7,

    elevation: 2,
  },

  attendanceHeader: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',
  },

  attendanceTitleRow: {
    flexDirection: 'row',

    alignItems: 'center',
  },

  attendanceIcon: {
    width: 34,
    height: 34,

    borderRadius: 10,

    backgroundColor: PRIMARY_LIGHT,

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 9,
  },

  attendanceTitle: {
    fontSize: 12.5,

    color: TEXT_DARK,

    fontWeight: '800',
  },

  attendanceSubtitle: {
    marginTop: 2,

    fontSize: 9.5,

    color: TEXT_MUTED,
  },

  refreshButton: {
    width: 34,
    height: 34,

    borderRadius: 10,

    backgroundColor: '#FAF8FC',

    borderWidth: 1,

    borderColor: '#EFE8F4',

    alignItems: 'center',
    justifyContent: 'center',
  },

  divider: {
    height: 1,

    backgroundColor: '#F1F5F9',

    marginVertical: 10,
  },

  activityLoading: {
    minHeight: 30,

    flexDirection: 'row',

    alignItems: 'center',
  },

  updatingText: {
    marginLeft: 8,

    fontSize: 10.5,

    color: TEXT_MUTED,
  },

  lastActivity: {
    flexDirection: 'row',

    alignItems: 'center',

    minHeight: 34,
  },

  successIcon: {
    width: 29,
    height: 29,

    borderRadius: 9,

    backgroundColor: '#DCFCE7',

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 9,
  },

  lastActivityContent: {
    flex: 1,
  },

  lastActivityLabel: {
    fontSize: 8,

    color: '#94A3B8',

    fontWeight: '700',

    letterSpacing: 0.4,
  },

  lastActivityText: {
    marginTop: 2,

    fontSize: 10.5,

    color: TEXT,

    fontWeight: '700',
  },

  completedBadge: {
    marginLeft: 7,

    paddingHorizontal: 7,

    paddingVertical: 4,

    borderRadius: 7,

    backgroundColor: '#ECFDF5',
  },

  completedText: {
    fontSize: 8.5,

    color: '#16A34A',

    fontWeight: '700',
  },

  noActivity: {
    flexDirection: 'row',

    alignItems: 'center',

    minHeight: 35,
  },

  noActivityIcon: {
    width: 30,
    height: 30,

    borderRadius: 9,

    backgroundColor: '#F1F5F9',

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 9,
  },

  noActivityTitle: {
    fontSize: 10.5,

    color: TEXT,

    fontWeight: '700',
  },

  noActivityText: {
    marginTop: 2,

    fontSize: 8.5,

    color: TEXT_MUTED,
  },

  // =======================================================
  // SCROLL
  // =======================================================

  scrollView: {
    flex: 1,

    backgroundColor: BG,
  },

  scrollContent: {
    paddingTop: 14,

    paddingHorizontal: 15,
  },

  // =======================================================
  // QUICK ACCESS
  // =======================================================

  sectionHeader: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 16,

    color: TEXT_DARK,

    fontWeight: '800',

    letterSpacing: -0.2,
  },

  sectionSubtitle: {
    marginTop: 2,

    fontSize: 9.5,

    color: TEXT_MUTED,
  },

  sectionIndicator: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: 4,
  },

  sectionIndicatorActive: {
    width: 16,
    height: 4,

    borderRadius: 4,

    backgroundColor: PRIMARY,
  },

  sectionIndicatorInactive: {
    width: 4,
    height: 4,

    borderRadius: 4,

    backgroundColor: '#D8DCE5',
  },
});