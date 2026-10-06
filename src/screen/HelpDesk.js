 import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dropdown } from 'react-native-element-dropdown';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SingleFilePicker from '../component/SingleFilePicker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RNFetchBlob from 'rn-fetch-blob';
import styles from './AddIssue.styles';

const ISSUE_TYPE_URL =
  'https://hrexim.tranzol.com/api/HelpDesk/GetIssueType';

/* ---------------------------------------------------
   STATUS
--------------------------------------------------- */

const STATUS_OPTIONS = [
  {
    id: 1,
    label: 'Open',
    icon: 'progress-clock',
  },
  {
    id: 2,
    label: 'In Progress',
    icon: 'progress-alert',
  },
  {
    id: 3,
    label: 'Resolved',
    icon: 'check-circle-outline',
  },
  {
    id: 4,
    label: 'Closed',
    icon: 'close-circle-outline',
  },
];

/* ---------------------------------------------------
   PRIORITY
--------------------------------------------------- */

const PRIORITY_OPTIONS = [
  {
    id: 1,
    label: 'Low',
    icon: 'flag-outline',
  },
  {
    id: 2,
    label: 'Medium',
    icon: 'flag',
  },
  {
    id: 3,
    label: 'High',
    icon: 'flag-variant',
  },
  {
    id: 4,
    label: 'Urgent',
    icon: 'flag-variant',
  },
];

const AddIssue = ({ navigation }) => {


  const [issueTypeId, setIssueTypeId] = useState(null);
  const [description, setDescription] = useState('');
                           


  const [statusId, setStatusId] = useState(1);
  const [priorityId, setPriorityId] = useState(1);

  const [targetDate, setTargetDate] = useState(null);
  const [closeDate, setCloseDate] = useState(null);

  const [closeRemarks, setCloseRemarks] = useState('');

  /* -------------------------------------------------
     API STATE
  ------------------------------------------------- */

  const [issueTypes, setIssueTypes] = useState([]);

  const [issueTypeLoading, setIssueTypeLoading] =
    useState(true);

  const [issueTypeError, setIssueTypeError] =
    useState('');

  /* -------------------------------------------------
     UI STATE
  ------------------------------------------------- */

  const [showTargetDatePicker, setShowTargetDatePicker] =
    useState(false);

  const [showCloseDatePicker, setShowCloseDatePicker] =
    useState(false);0

  const [descriptionFocused, setDescriptionFocused] =
    useState(false);

  const [closeRemarksFocused, setCloseRemarksFocused] =
    useState(false);

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

const [selectedFiles, setSelectedFiles] = useState([]);
  const handleFileSelected = (files) => {
      
        setSelectedFiles(files);
      };
  /* -------------------------------------------------
     FETCH ISSUE TYPES
  ------------------------------------------------- */

  const fetchIssueTypes = async () => {
    try {
      setIssueTypeLoading(true);
      setIssueTypeError('');

      const token = await AsyncStorage.getItem(
        'access_token'
      );

      if (!token) {
        Alert.alert(
          'token not available . Please login again.'
        );

        return;
      }

      const response = await fetch(
        ISSUE_TYPE_URL,
        {
          method: 'GET',

          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        setIssueTypeError(
          'Your session has expired. Please login again.'
        );

        return;
      }

      if (!response.ok) {
        throw new Error(
          `Unable to load issue types (${response.status})`
        );
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error(
          'Invalid issue type response from server.'
        );
      }

      const formattedData = data
        .filter(item => item?.Id != null)
        .map(item => ({
          Id: item.Id,
          TicketType: item.TicketType || 'Unnamed Issue',
        }));

      setIssueTypes(formattedData);
    } catch (error) {
      console.log(
        'GetIssueType Error:',
        error
      );

      if (
        error?.message?.includes(
          'Network request failed'
        )
      ) {
        setIssueTypeError(
          'Unable to connect to the server. Please check your internet connection.'
        );
      } else {
        setIssueTypeError(
          error?.message ||
            'Unable to load issue types.'
        );
      }
    } finally {
      setIssueTypeLoading(false);
    }
  };

  useEffect(() => {
    fetchIssueTypes();
  }, []);

  /* -------------------------------------------------
     DROPDOWN DATA
  ------------------------------------------------- */

  const issueTypeData = useMemo(
    () =>
      issueTypes.map(item => ({
        label: item.TicketType,
        value: item.Id,
      })),
    [issueTypes]
  );



  const statusData = useMemo(
    () =>
      STATUS_OPTIONS.map(item => ({
        label: item.label,
        value: item.id,
        icon: item.icon,
      })),
    []
  );

  const priorityData = useMemo(
    () =>
      PRIORITY_OPTIONS.map(item => ({
        label: item.label,
        value: item.id,
        icon: item.icon,
      })),
    []
  );

  /* -------------------------------------------------
     HELPERS
  ------------------------------------------------- */

  const formatDate = date => {
    if (!date) return '';

    const day = String(
      date.getDate()
    ).padStart(2, '0');

    const month = String(
      date.getMonth() + 1
    ).padStart(2, '0');

    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const clearError = field => {
    if (!errors[field]) return;

    setErrors(prev => ({
      ...prev,
      [field]: '',
    }));
  };

  const handleTargetDateChange = (
    event,
    selectedDate
  ) => {
    setShowTargetDatePicker(false);

    if (
      event?.type === 'dismissed' ||
      !selectedDate
    ) {
      return;
    }

    setTargetDate(selectedDate);
  };

  const handleCloseDateChange = (
    event,
    selectedDate
  ) => {
    setShowCloseDatePicker(false);

    if (
      event?.type === 'dismissed' ||
      !selectedDate
    ) {
      return;
    }

    setCloseDate(selectedDate);
  };

  /* -------------------------------------------------
     SAVE
  ------------------------------------------------- */


const handleSave = async () => {
  // -----------------------------
  // FORM VALIDATION
  // -----------------------------

  if (!issueTypeId) {
    Alert.alert('Validation', 'Please select an issue type.');
    return;
  }

  if (!description.trim()) {
    Alert.alert('Validation', 'Please enter the issue description.');
    return;
  }

  if (!statusId) {
    Alert.alert('Validation', 'Please select a status.');
    return;
  }

  if (!priorityId) {
    Alert.alert('Validation', 'Please select a priority.');
    return;
  }

  try {
    setSaving(true);

    // -----------------------------
    // GET ACCESS TOKEN
    // -----------------------------

    const token = await AsyncStorage.getItem('access_token');

    if (!token) {
      Alert.alert(
        'Session Expired',
        'Your session has expired. Please login again.'
      );
      return;
    }

    // -----------------------------
    // GET EMPLOYEE DETAILS
    // -----------------------------

    const details = await AsyncStorage.getItem('employeeDetails');

    if (!details) {
      Alert.alert('Error', 'User id not found');
      return;
    }

    let parsedDetails;

    try {
      parsedDetails = JSON.parse(details);
    } catch (error) {
      console.log('Employee Details Parse Error:', error);

      Alert.alert(
        'Error',
        'Unable to read employee details.'
      );
      return;
    }

    const employeeId = parsedDetails?.EmployeeId;

    if (!employeeId) {
      Alert.alert('Error', 'User id not found');
      return;
    }

    // -----------------------------
    // CREATE FORMDATA
    // -----------------------------

    const formData = new FormData();

    formData.append(
      'IssueTypeId',
      String(issueTypeId)
    );

    formData.append(
      'Description',
      description.trim()
    );

    formData.append(
      'StatusId',
      String(statusId)
    );

    formData.append(
      'PriorityId',
      String(priorityId)
    );

    formData.append(
      'UserId',
      String(employeeId)
    );

    formData.append(
      'InsertDate',
      new Date().toISOString()
    );

    // TargetDate
    if (targetDate) {
      formData.append(
        'TargetDate',
        targetDate.toISOString()
      );
    }

    // CloseDate
    if (closeDate) {
      formData.append(
        'CloseDate',
        closeDate.toISOString()
      );
    }

    // CloseRemarks
    if (closeRemarks.trim()) {
      formData.append(
        'CloseRemarks',
        closeRemarks.trim()
      );
    }

selectedFiles.forEach((file, index) => {
  formData.append('Attachment', {
    uri: file.uri,
    name: file.name,
    type: file.type,
  });
});
    // -----------------------------
    // LOG FOR DEBUGGING
    // -----------------------------

    console.log('Create Issue FormData:' , formData);

    console.log('IssueTypeId:', issueTypeId);
    console.log('Description:', description.trim());
    console.log('StatusId:', statusId);
    console.log('PriorityId:', priorityId);
    console.log('UserId:', employeeId);
    console.log(
      'InsertDate:',
      new Date().toISOString()
    );
    console.log(
      'TargetDate:',
      targetDate
        ? targetDate.toISOString()
        : null
    );
    console.log(
      'CloseDate:',
      closeDate
        ? closeDate.toISOString()
        : null
    );
    console.log(
      'CloseRemarks:',
      closeRemarks.trim() || null
    );

    // -----------------------------
    // API REQUEST
    // -----------------------------

    const response = await fetch(
      'https://hrexim.tranzol.com/api/HelpDesk/Create',
      {
        method: 'POST',

        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },

        body: formData,
      }
    );

    // -----------------------------
    // READ SERVER RESPONSE
    // -----------------------------

    const responseText = await response.text();

    console.log(
      'Server Response:',
      responseText
    );

    let serverMessage = responseText;

    // -----------------------------
    // HANDLE JSON OR TEXT RESPONSE
    // -----------------------------

    try {
      const jsonData = responseText
        ? JSON.parse(responseText)
        : null;

      if (jsonData) {
        serverMessage =
          jsonData?.message ||
          jsonData?.Message ||
          jsonData?.msg ||
          jsonData?.ErrorMsg ||
          jsonData?.data ||
          responseText;
      }
    } catch (error) {
      // Server returned simple text
      serverMessage = responseText;
    }

    console.log(
      'API Message:',
      serverMessage
    );

    // -----------------------------
    // 401 SESSION EXPIRED
    // -----------------------------

    if (response.status === 401) {
      Alert.alert(
        'Session Expired',
        'Your session has expired. Please login again.'
      );

      return;
    }

    // -----------------------------
    // CHECK SUCCESS USING includes()
    // -----------------------------

    if (
      response.ok &&
      String(serverMessage)
        .toLowerCase()
        .includes('success')
    ) {
      Alert.alert(
        'Success',
        serverMessage || 'Issue created successfully.'
      );

      // Clear form
  
      setCloseRemarks('');
      setTargetDate(null);
      setCloseDate(null);

      return;
    }

    // -----------------------------
    // API ERROR
    // -----------------------------

    if (!response.ok) {
      console.log(
        'API Error:',
        serverMessage
      );

      Alert.alert(
        `Error ${response.status}`,
        serverMessage ||
          'Unable to create the issue. Please try again.'
      );

      return;
    }

    // -----------------------------
    // HTTP SUCCESS
    // -----------------------------

    Alert.alert(
      'Success',
      serverMessage ||
        'Issue created successfully.'
    );

  } catch (error) {
    console.log(
      'Create Issue Error:',
      error
    );

    // -----------------------------
    // NETWORK ERROR
    // -----------------------------

    if (
      error?.message?.includes(
        'Network request failed'
      )
    ) {
      Alert.alert(
        'Network Error',
        'Unable to connect to the server. Please check your internet connection.'
      );
    } else {
      Alert.alert(
        'Error',
        error?.message ||
          'Something went wrong while creating the issue.'
      );
    }

  } finally {
    setSaving(false);
  }
};

  /* -------------------------------------------------
     CUSTOM DROPDOWN ITEM
  ------------------------------------------------- */

  const renderDropdownItem = (
    item,
    selectedValue,
    type
  ) => {
    const isSelected =
      item.value === selectedValue;

    let icon = 'chevron-right';
    let iconColor = '#64748B';

    if (type === 'status') {
      const status = STATUS_OPTIONS.find(
        x => x.id === item.value
      );

      icon =
        status?.icon ||
        'circle-outline';

      if (item.value === 1) {
        iconColor = '#aa18ea';
      }

      if (item.value === 2) {
        iconColor = '#F59E0B';
      }

      if (item.value === 3) {
        iconColor = '#10B981';
      }

      if (item.value === 4) {
        iconColor = '#64748B';
      }
    }

    if (type === 'priority') {
      icon = 'flag-outline';

      if (item.value === 1) {
        iconColor = '#64748B';
      }

      if (item.value === 2) {
        iconColor = '#F59E0B';
      }

      if (item.value === 3) {
        iconColor = '#F97316';
      }

      if (item.value === 4) {
        iconColor = '#DC2626';
      }
    }

    if (type === 'issueType') {
      icon = 'tag-outline';
      iconColor = '#aa18ea';
    }

    if (type === 'resolvedUser') {
      icon = 'account-outline';
      iconColor = '#aa18ea';
    }

    return (
      <View
        style={[
          styles.dropdownItem,
          isSelected &&
            styles.dropdownItemSelected,
        ]}
      >
        <View style={styles.dropdownItemLeft}>
          <View
            style={[
              styles.dropdownItemIcon,
              isSelected &&
                styles.dropdownItemIconSelected,
            ]}
          >
            <MaterialCommunityIcons
              name={icon}
              size={18}
              color={
                isSelected
                  ? '#aa18ea'
                  : iconColor
              }
            />
          </View>

          <Text
            style={[
              styles.dropdownItemText,
              isSelected &&
                styles.dropdownItemTextSelected,
            ]}
          >
            {item.label}
          </Text>
        </View>

        {isSelected && (
          <View style={styles.selectedCheck}>
            <Ionicons
              name="checkmark"
              size={15}
              color="#FFFFFF"
            />
          </View>
        )}
      </View>
    );
  };

  /* -------------------------------------------------
     DROPDOWN STYLE FACTORY
  ------------------------------------------------- */

  const getDropdownStyle = (
    hasError = false
  ) => [
    styles.dropdown,
    hasError && styles.dropdownError,
  ];

  /* -------------------------------------------------
     RENDER
  ------------------------------------------------- */

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >
        {/* -----------------------------------------
            HEADER
        ------------------------------------------ */}

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={() =>
              navigation?.goBack()
            }
            activeOpacity={0.8}
          >
            <Ionicons
              name="arrow-back"
              size={21}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>
              Add Issue
            </Text>

            <Text style={styles.headerSubtitle}>
              Create a new help desk ticket
            </Text>
          </View>

          <TouchableOpacity
            style={styles.headerSave}
            onPress={handleSave}
            activeOpacity={0.8}
          >
            <Ionicons
              name="checkmark"
              size={22}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>

        {/* -----------------------------------------
            CONTENT
        ------------------------------------------ */}

        <ScrollView
          style={styles.container}
          contentContainerStyle={
            styles.contentContainer
          }
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ---------------------------------------
              ISSUE INFORMATION
          ---------------------------------------- */}

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon}>
                <MaterialCommunityIcons
                  name="ticket-outline"
                  size={18}
                  color="#aa18ea"
                />
              </View>

              <View>
                <Text style={styles.sectionTitle}>
                  Issue Information
                </Text>

                <Text
                  style={
                    styles.sectionDescription
                  }
                >
                  Provide details about the issue
                </Text>
              </View>
            </View>

            {/* ISSUE TYPE */}

            <View style={styles.field}>
              <Text style={styles.label}>
                Issue Type
                <Text style={styles.required}>
                  {' '}
                  *
                </Text>
              </Text>

              {issueTypeError ? (
                <View
                  style={styles.apiErrorBox}
                >
                  <View
                    style={
                      styles.apiErrorContent
                    }
                  >
                    <View
                      style={
                        styles.apiErrorIcon
                      }
                    >
                      <Ionicons
                        name="alert-circle-outline"
                        size={19}
                        color="#DC2626"
                      />
                    </View>

                    <View
                      style={
                        styles.apiErrorTextContainer
                      }
                    >
                      <Text
                        style={
                          styles.apiErrorTitle
                        }
                      >
                        Unable to load issue types
                      </Text>

                      <Text
                        style={
                          styles.apiErrorMessage
                        }
                      >
                        {issueTypeError}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.retryButton}
                    onPress={fetchIssueTypes}
                    disabled={
                      issueTypeLoading
                    }
                  >
                    <Ionicons
                      name="refresh-outline"
                      size={16}
                      color="#aa18ea"
                    />

                    <Text
                      style={styles.retryText}
                    >
                      Try Again
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <Dropdown
                  style={getDropdownStyle(
                    !!errors.issueTypeId
                  )}
                  containerStyle={
                    styles.dropdownContainer
                  }
                  placeholderStyle={
                    styles.placeholderStyle
                  }
                  selectedTextStyle={
                    styles.selectedTextStyle
                  }
                  inputSearchStyle={
                    styles.inputSearchStyle
                  }
                  itemTextStyle={
                    styles.itemTextStyle
                  }
                  activeColor="#EFF6FF"
                  search
                  searchPlaceholder="Search issue type..."
                  data={issueTypeData}
                  labelField="label"
                  valueField="value"
                  value={issueTypeId}
                  placeholder={
                    issueTypeLoading
                      ? 'Loading issue types...'
                      : 'Select issue type'
                  }
                  disable={
                    issueTypeLoading ||
                    issueTypeData.length === 0
                  }
                  renderLeftIcon={() => (
                    <MaterialCommunityIcons
                      name="tag-outline"
                      size={20}
                      color="#64748B"
                      style={
                        styles.dropdownLeftIcon
                      }
                    />
                  )}
                  renderRightIcon={() =>
                    issueTypeLoading ? (
                      <ActivityIndicator
                        size="small"
                        color="#aa18ea"
                      />
                    ) : (
                      <Ionicons
                        name="chevron-down"
                        size={19}
                        color="#64748B"
                      />
                    )
                  }
                  renderItem={item =>
                    renderDropdownItem(
                      item,
                      issueTypeId,
                      'issueType'
                    )
                  }
                  onChange={item => {
                    setIssueTypeId(
                      item.value
                    );

                    clearError(
                      'issueTypeId'
                    );
                  }}
                />
              )}

              {errors.issueTypeId &&
                !issueTypeError && (
                  <Text
                    style={styles.errorText}
                  >
                    {errors.issueTypeId}
                  </Text>
                )}
            </View>

            {/* DESCRIPTION */}

            <View style={styles.field}>
              <Text style={styles.label}>
                Description
                <Text style={styles.required}>
                  {' '}
                  *
                </Text>
              </Text>

              <View
                style={[
                  styles.textInputContainer,
                  styles.descriptionContainer,
                  descriptionFocused &&
                    styles.textInputFocused,
                  errors.description &&
                    styles.textInputError,
                ]}
              >
                <MaterialCommunityIcons
                  name="text-box-outline"
                  size={20}
                  color={
                    descriptionFocused
                      ? '#aa18ea'
                      : '#64748B'
                  }
                  style={
                    styles.textAreaIcon
                  }
                />

                <TextInput
                  style={styles.textArea}
                  placeholder="Describe the issue clearly..."
                  placeholderTextColor="#94A3B8"
                  multiline
                  textAlignVertical="top"
                  value={description}
                  onFocus={() =>
                    setDescriptionFocused(
                      true
                    )
                  }
                  onBlur={() =>
                    setDescriptionFocused(
                      false
                    )
                  }
                  onChangeText={text => {
                    setDescription(text);
                    clearError(
                      'description'
                    );
                  }}
                />
              </View>

              {errors.description && (
                <Text
                  style={styles.errorText}
                >
                  {errors.description}
                </Text>
              )}
            </View>

            {/* RESOLVED USER */}

            <View
              style={[
                styles.field,
                styles.lastField,
              ]}
            >
             
            </View>
          </View>

          {/* ---------------------------------------
              STATUS & PRIORITY
          ---------------------------------------- */}

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon}>
                <MaterialCommunityIcons
                  name="tune-variant"
                  size={18}
                  color="#aa18ea"
                />
              </View>

              <View>
                <Text style={styles.sectionTitle}>
                  Status & Priority
                </Text>

                <Text
                  style={
                    styles.sectionDescription
                  }
                >
                  Set the current state and urgency
                </Text>
              </View>
            </View>

            {/* STATUS */}

            <View style={styles.field}>
              <Text style={styles.label}>
                Status
                <Text style={styles.required}>
                  {' '}
                  *
                </Text>
              </Text>

              <Dropdown
                style={getDropdownStyle(
                  !!errors.statusId
                )}
                containerStyle={
                  styles.dropdownContainer
                }
                placeholderStyle={
                  styles.placeholderStyle
                }
                selectedTextStyle={
                  styles.selectedTextStyle
                }
                inputSearchStyle={
                  styles.inputSearchStyle
                }
                itemTextStyle={
                  styles.itemTextStyle
                }
                activeColor="#EFF6FF"
                data={statusData}
                labelField="label"
                valueField="value"
                value={statusId}
                placeholder="Select status"
                renderLeftIcon={() => (
                  <View
                    style={[
                      styles.statusIndicator,
                      {
                        backgroundColor:
                          statusId === 1
                            ? '#aa18ea'
                            : statusId === 2
                            ? '#F59E0B'
                            : statusId === 3
                            ? '#10B981'
                            : '#64748B',
                      },
                    ]}
                  />
                )}
                renderRightIcon={() => (
                  <Ionicons
                    name="chevron-down"
                    size={19}
                    color="#64748B"
                  />
                )}
                renderItem={item =>
                  renderDropdownItem(
                    item,
                    statusId,
                    'status'
                  )
                }
                onChange={item => {
                  setStatusId(item.value);
                  clearError('statusId');
                }}
              />

              {errors.statusId && (
                <Text
                  style={styles.errorText}
                >
                  {errors.statusId}
                </Text>
              )}
            </View>

            {/* PRIORITY */}

            <View
              style={[
                styles.field,
                styles.lastField,
              ]}
            >
              <Text style={styles.label}>
                Priority
                <Text style={styles.required}>
                  {' '}
                  *
                </Text>
              </Text>

              <Dropdown
                style={getDropdownStyle(
                  !!errors.priorityId
                )}
                containerStyle={
                  styles.dropdownContainer
                }
                placeholderStyle={
                  styles.placeholderStyle
                }
                selectedTextStyle={
                  styles.selectedTextStyle
                }
                inputSearchStyle={
                  styles.inputSearchStyle
                }
                itemTextStyle={
                  styles.itemTextStyle
                }
                activeColor="#EFF6FF"
                data={priorityData}
                labelField="label"
                valueField="value"
                value={priorityId}
                placeholder="Select priority"
                renderLeftIcon={() => (
                  <MaterialCommunityIcons
                    name="flag-outline"
                    size={20}
                    color={
                      priorityId === 4
                        ? '#DC2626'
                        : priorityId === 3
                        ? '#F97316'
                        : priorityId === 2
                        ? '#F59E0B'
                        : '#64748B'
                    }
                    style={
                      styles.dropdownLeftIcon
                    }
                  />
                )}
                renderRightIcon={() => (
                  <Ionicons
                    name="chevron-down"
                    size={19}
                    color="#64748B"
                  />
                )}
                renderItem={item =>
                  renderDropdownItem(
                    item,
                    priorityId,
                    'priority'
                  )
                }
                onChange={item => {
                  setPriorityId(
                    item.value
                  );

                  clearError(
                    'priorityId'
                  );
                }}
              />

              {errors.priorityId && (
                <Text
                  style={styles.errorText}
                >
                  {errors.priorityId}
                </Text>
              )}
            </View>
          </View>

          {/* ---------------------------------------
              SCHEDULE
          ---------------------------------------- */}

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon}>
                <MaterialCommunityIcons
                  name="calendar-clock-outline"
                  size={18}
                  color="#aa18ea"
                />
              </View>

              <View>
                <Text style={styles.sectionTitle}>
                  Schedule
                </Text>

                <Text
                  style={
                    styles.sectionDescription
                  }
                >
                  Set target and closure dates
                </Text>
              </View>
            </View>

            {/* TARGET DATE */}

            <View style={styles.field}>
              <Text style={styles.label}>
                Target Date
              </Text>

              <TouchableOpacity
                style={styles.dateInput}
                activeOpacity={0.8}
                onPress={() =>
                  setShowTargetDatePicker(
                    true
                  )
                }
              >
                <View
                  style={
                    styles.dateInputLeft
                  }
                >
                  <Ionicons
                    name="calendar-outline"
                    size={20}
                    color="#64748B"
                  />

                  <Text
                    style={[
                      styles.dateText,
                      !targetDate &&
                        styles.placeholderText,
                    ]}
                  >
                    {targetDate
                      ? formatDate(
                          targetDate
                        )
                      : 'Select target date'}
                  </Text>
                </View>

                <Ionicons
                  name="chevron-down"
                  size={18}
                  color="#64748B"
                />
              </TouchableOpacity>
            </View>

            {/* CLOSE DATE */}

            <View style={styles.field}>
              <Text style={styles.label}>
                Close Date
              </Text>

              <TouchableOpacity
                style={styles.dateInput}
                activeOpacity={0.8}
                onPress={() =>
                  setShowCloseDatePicker(
                    true
                  )
                }
              >
                <View
                  style={
                    styles.dateInputLeft
                  }
                >
                  <Ionicons
                    name="calendar-outline"
                    size={20}
                    color="#64748B"
                  />

                  <Text
                    style={[
                      styles.dateText,
                      !closeDate &&
                        styles.placeholderText,
                    ]}
                  >
                    {closeDate
                      ? formatDate(
                          closeDate
                        )
                      : 'Select close date'}
                  </Text>
                </View>

                <Ionicons
                  name="chevron-down"
                  size={18}
                  color="#64748B"
                />
              </TouchableOpacity>
            </View>

            {/* CLOSE REMARKS */}

            <View
              style={[
                styles.field,
                styles.lastField,
              ]}
            >
              <Text style={styles.label}>
                Close Remarks
              </Text>

              <View
                style={[
                  styles.textInputContainer,
                  styles.descriptionContainer,
                  closeRemarksFocused &&
                    styles.textInputFocused,
                ]}
              >
                <MaterialCommunityIcons
                  name="message-text-outline"
                  size={20}
                  color={
                    closeRemarksFocused
                      ? '#aa18ea'
                      : '#64748B'
                  }
                  style={
                    styles.textAreaIcon
                  }
                />

                <TextInput
                  style={styles.textArea}
                  placeholder="Enter closing remarks..."
                  placeholderTextColor="#94A3B8"
                  multiline
                  textAlignVertical="top"
                  value={closeRemarks}
                  onFocus={() =>
                    setCloseRemarksFocused(
                      true
                    )
                  }
                  onBlur={() =>
                    setCloseRemarksFocused(
                      false
                    )
                  }
                  onChangeText={
                    setCloseRemarks
                  }
                />
              </View>
            </View>
          </View>

          {/* ---------------------------------------
              SAVE BUTTON
          ---------------------------------------- */}
   <SingleFilePicker onFileSelected={handleFileSelected} />
       <TouchableOpacity
  style={[
    styles.saveButton,
    saving && styles.saveButtonDisabled,
  ]}
  onPress={handleSave}
  disabled={saving}
  activeOpacity={0.8}
>
  {saving ? (
    <>
      <ActivityIndicator
        size="small"
        color="#FFFFFF"
      />

      <Text style={styles.saveButtonText}>
        Creating...
      </Text>
    </>
  ) : (
    <>
      <Ionicons
        name="checkmark-circle-outline"
        size={20}
        color="#FFFFFF"
      />

      <Text style={styles.saveButtonText}>
        Create Issue
      </Text>
    </>
  )}
</TouchableOpacity>

          <View style={styles.bottomSpace} />
        </ScrollView>

        {/* -----------------------------------------
            TARGET DATE PICKER
        ------------------------------------------ */}

        {showTargetDatePicker && (
          <DateTimePicker
            value={
              targetDate || new Date()
            }
            mode="date"
            display={
              Platform.OS === 'ios'
                ? 'spinner'
                : 'default'
            }
            onChange={
              handleTargetDateChange
            }
          />
        )}

        {/* -----------------------------------------
            CLOSE DATE PICKER
        ------------------------------------------ */}

        {showCloseDatePicker && (
          <DateTimePicker
            value={
              closeDate || new Date()
            }
            mode="date"
            display={
              Platform.OS === 'ios'
                ? 'spinner'
                : 'default'
            }
            onChange={
              handleCloseDateChange
            }
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddIssue;