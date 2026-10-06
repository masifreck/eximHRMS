import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  /* =================================================
     SCREEN
  ================================================= */

  safeArea: {
    flex: 1,
    backgroundColor: '#F6F8FC',
  },

  keyboardContainer: {
    flex: 1,
  },

  container: {
    flex: 1,
  },

  contentContainer: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 25,
  },

  /* =================================================
     HEADER
  ================================================= */

  header: {
    height: 70,
    backgroundColor: '#aa18ea',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,

    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,

    elevation: 5,

    shadowColor: '#aa18ea',
    shadowOffset: {
      width: 0, 
      height: 3,
    },
    shadowOpacity: 0.18,
    shadowRadius: 7,
  },

  headerIconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor:
      'rgba(255,255,255,0.14)',
  },

  headerContent: {
    flex: 1,
    marginLeft: 12,
  },

  headerTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: 0.1,
  },

  headerSubtitle: {
    color:
      'rgba(255,255,255,0.72)',
    fontSize: 11,
    marginTop: 2,
  },

  headerSave: {
    width: 40,
    height: 40,
    borderRadius: 12,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor:
      'rgba(255,255,255,0.15)',
  },

  /* =================================================
     SECTION
  ================================================= */

  section: {
    backgroundColor: '#FFFFFF',

    borderRadius: 17,

    padding: 15,

    marginBottom: 13,

    borderWidth: 1,
    borderColor: '#E9EEF5',

    shadowColor: '#0F172A',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.035,
    shadowRadius: 8,

    elevation: 1,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',

    marginBottom: 17,
  },

  sectionIcon: {
    width: 35,
    height: 35,

    borderRadius: 10,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#EFF6FF',

    marginRight: 10,
  },

  sectionTitle: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '700',
  },

  sectionDescription: {
    color: '#94A3B8',
    fontSize: 10.5,
    marginTop: 2,
  },

  /* =================================================
     FIELD
  ================================================= */

  field: {
    marginBottom: 16,
  },

  lastField: {
    marginBottom: 0,
  },

  label: {
    color: '#1E293B',
    fontSize: 12.5,
    fontWeight: '600',
    marginBottom: 7,
  },

  required: {
    color: '#EF4444',
  },

  /* =================================================
     DROPDOWN
  ================================================= */

  dropdown: {
    height: 48,

    borderWidth: 1,
    borderColor: '#DFE5ED',

    borderRadius: 11,

    paddingHorizontal: 12,

    backgroundColor: '#FFFFFF',
  },

  dropdownError: {
    borderColor: '#EF4444',
    backgroundColor: '#FFF8F8',
  },

  dropdownContainer: {
    borderRadius: 13,

    borderWidth: 1,
    borderColor: '#E2E8F0',

    backgroundColor: '#FFFFFF',

    overflow: 'hidden',

    elevation: 8,

    shadowColor: '#0F172A',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.12,
    shadowRadius: 14,
  },

  dropdownLeftIcon: {
    marginRight: 9,
  },

  placeholderStyle: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '400',
  },

  selectedTextStyle: {
    color: '#172033',
    fontSize: 13,
    fontWeight: '600',
  },

  itemTextStyle: {
    color: '#334155',
    fontSize: 13,
  },

  inputSearchStyle: {
    height: 42,

    borderRadius: 9,

    borderWidth: 1,
    borderColor: '#D7E1F0',

    backgroundColor: '#F8FAFC',

    color: '#1E293B',

    fontSize: 13,

    paddingHorizontal: 12,

    margin: 8,
  },

  /* =================================================
     CUSTOM DROPDOWN ITEM
  ================================================= */

  dropdownItem: {
    minHeight: 50,

    paddingHorizontal: 11,

    marginHorizontal: 5,
    marginVertical: 2,

    borderRadius: 10,

    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'space-between',
  },

  dropdownItemSelected: {
    backgroundColor: '#EFF6FF',
  },

  dropdownItemLeft: {
    flex: 1,

    flexDirection: 'row',
    alignItems: 'center',
  },

  dropdownItemIcon: {
    width: 32,
    height: 32,

    borderRadius: 9,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#F8FAFC',

    marginRight: 10,
  },

  dropdownItemIconSelected: {
    backgroundColor: '#DBEAFE',
  },

  dropdownItemText: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '500',
  },

  dropdownItemTextSelected: {
    color: '#aa18ea',
    fontWeight: '700',
  },

  selectedCheck: {
    width: 23,
    height: 23,

    borderRadius: 12,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#aa18ea',
  },

  /* =================================================
     STATUS
  ================================================= */

  statusIndicator: {
    width: 9,
    height: 9,

    borderRadius: 5,

    marginRight: 9,
  },

  /* =================================================
     TEXT INPUT
  ================================================= */

  textInputContainer: {
    minHeight: 48,

    borderWidth: 1,
    borderColor: '#DFE5ED',

    borderRadius: 11,

    backgroundColor: '#FFFFFF',

    flexDirection: 'row',

    paddingHorizontal: 12,
  },

  textInputFocused: {
    borderColor: '#aa18ea',

    backgroundColor: '#FBFDFF',

    shadowColor: '#aa18ea',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,

    elevation: 1,
  },

  textInputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FFF8F8',
  },

  descriptionContainer: {
    minHeight: 105,

    paddingTop: 12,

    alignItems: 'flex-start',
  },

  textAreaIcon: {
    marginTop: 2,
    marginRight: 9,
  },

  textArea: {
    flex: 1,

    minHeight: 82,

    padding: 0,

    color: '#172033',

    fontSize: 13.5,

    lineHeight: 20,
  },

  /* =================================================
     DATE
  ================================================= */

  dateInput: {
    height: 48,

    borderWidth: 1,
    borderColor: '#DFE5ED',

    borderRadius: 11,

    paddingHorizontal: 12,

    backgroundColor: '#FFFFFF',

    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'space-between',
  },

  dateInputLeft: {
    flex: 1,

    flexDirection: 'row',
    alignItems: 'center',
  },

  dateText: {
    color: '#172033',

    fontSize: 13,

    fontWeight: '500',

    marginLeft: 9,
  },

  placeholderText: {
    color: '#94A3B8',
    fontWeight: '400',
  },

  /* =================================================
     ERROR
  ================================================= */

  errorText: {
    color: '#DC2626',

    fontSize: 10.5,

    marginTop: 5,
    marginLeft: 2,
  },

  /* =================================================
     API ERROR
  ================================================= */

  apiErrorBox: {
    borderWidth: 1,

    borderColor: '#FECACA',

    backgroundColor: '#FFF7F7',

    borderRadius: 11,

    padding: 11,
  },

  apiErrorContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  apiErrorIcon: {
    width: 34,
    height: 34,

    borderRadius: 9,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#FEE2E2',
  },

  apiErrorTextContainer: {
    flex: 1,
    marginLeft: 9,
  },

  apiErrorTitle: {
    color: '#991B1B',

    fontSize: 12,

    fontWeight: '700',
  },

  apiErrorMessage: {
    color: '#B91C1C',

    fontSize: 10.5,

    lineHeight: 16,

    marginTop: 3,
  },

  retryButton: {
    height: 36,

    marginTop: 10,

    borderRadius: 9,

    borderWidth: 1,
    borderColor: '#BFDBFE',

    backgroundColor: '#FFFFFF',

    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'center',
  },

  retryText: {
    color: '#aa18ea',

    fontSize: 11.5,

    fontWeight: '700',

    marginLeft: 5,
  },

  helperText: {
    color: '#94A3B8',

    fontSize: 10,

    marginTop: 5,
  },

  /* =================================================
     SAVE BUTTON
  ================================================= */

  saveButton: {
    height: 52,

    borderRadius: 14,

    backgroundColor: '#aa18ea',

    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: 16,

    shadowColor: '#aa18ea',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 9,

    elevation: 4,
  },

  saveButtonIcon: {
    width: 27,
    height: 27,

    borderRadius: 9,

    backgroundColor: '#FFFFFF',

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 8,
  },

  saveButtonText: {
    color: '#FFFFFF',

    fontSize: 14,

    fontWeight: '700',

    flex: 1,
  },

  bottomSpace: {
    height: 15,
  },
  saveButton: {
  minHeight: 52,
  borderRadius: 14,
  backgroundColor: '#aa18ea',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  marginTop: 12,
  marginBottom: 20,
},

saveButtonDisabled: {
  opacity: 0.7,
},

saveButtonText: {
  color: '#FFFFFF',
  fontSize: 15,
  fontWeight: '700',
},

errorCard: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#FEF2F2',
  borderWidth: 1,
  borderColor: '#FECACA',
  borderRadius: 12,
  paddingHorizontal: 14,
  paddingVertical: 12,
  marginBottom: 16,
  gap: 9,
},

errorText: {
  flex: 1,
  color: '#B91C1C',
  fontSize: 13,
  lineHeight: 19,
  fontWeight: '500',
},

responseCard: {
  backgroundColor: '#FFFFFF',
  borderRadius: 16,
  borderWidth: 1,
  borderColor: '#DCFCE7',
  padding: 15,
  marginBottom: 24,

  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.05,
  shadowRadius: 8,
  elevation: 2,
},

responseHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 12,
},

responseIcon: {
  width: 40,
  height: 40,
  borderRadius: 12,
  backgroundColor: '#F0FDF4',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 11,
},

responseTitle: {
  color: '#166534',
  fontSize: 15,
  fontWeight: '700',
},

responseSubtitle: {
  color: '#64748B',
  fontSize: 12,
  marginTop: 2,
},

responseBody: {
  backgroundColor: '#F8FAFC',
  borderRadius: 10,
  padding: 12,
  borderWidth: 1,
  borderColor: '#E2E8F0',
},

responseText: {
  color: '#334155',
  fontSize: 12,
  lineHeight: 19,
  fontFamily:
    Platform.OS === 'ios'
      ? 'Menlo'
      : 'monospace',
},
});

export default styles;