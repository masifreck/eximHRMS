import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  // =========================
  // HEADER
  // =========================

  header: {
    backgroundColor: '#aa18ea',
    minHeight: 72,
    paddingHorizontal: 16,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  headerIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.1,
  },

  headerSubtitle: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 11,
    marginTop: 2,
  },

  createButton: {
    backgroundColor: '#FFFFFF',
    height: 38,
    paddingHorizontal: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },

  createButtonText: {
    color: '#aa18ea',
    fontSize: 13,
    fontWeight: '700',
  },

  // =========================
  // SEARCH
  // =========================

  searchWrapper: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 5,
  },

  searchContainer: {
    height: 46,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
  },

  searchInput: {
    flex: 1,
    marginLeft: 9,
    color: '#0F172A',
    fontSize: 14,
    paddingVertical: 0,
  },

  // =========================
  // LIST HEADER
  // =========================

  listHeader: {
    paddingHorizontal: 16,
    paddingTop: 13,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  listTitle: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '700',
  },

  ticketCount: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '500',
  },

  // =========================
  // LIST
  // =========================

  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },

  emptyList: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },

  // =========================
  // TICKET CARD
  // =========================

  ticketCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E8EEF5',
    padding: 14,
    marginBottom: 12,

    shadowColor: '#0F172A',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.05,
    shadowRadius: 7,
    elevation: 2,
  },

  ticketTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  ticketIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },

  ticketIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  ticketNumber: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '700',
  },

  ticketType: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 3,
    maxWidth: 200,
  },

  priorityBadge: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 7,
  },

  priorityText: {
    fontSize: 10,
    fontWeight: '700',
  },

  // =========================
  // DESCRIPTION
  // =========================

  descriptionContainer: {
    marginTop: 13,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },

  descriptionLabel: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 5,
  },

  description: {
    color: '#334155',
    fontSize: 13,
    lineHeight: 19,
  },

  // =========================
  // STATUS
  // =========================

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 13,
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 8,
  },

  statusText: {
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 5,
  },

  resolvedBy: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
    flex: 1,
  },

  resolvedByText: {
    color: '#64748B',
    fontSize: 11,
    marginLeft: 5,
    flexShrink: 1,
  },

  // =========================
  // DATES
  // =========================

  dateContainer: {
    marginTop: 13,
    paddingTop: 11,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    flexDirection: 'row',
    alignItems: 'center',
  },

  dateItem: {
    flex: 1,
  },

  dateLabel: {
    color: '#94A3B8',
    fontSize: 10,
    marginBottom: 3,
  },

  dateValue: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '600',
  },

  dateDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 15,
  },

  // =========================
  // REMARKS
  // =========================

  remarksContainer: {
    marginTop: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
  },

  remarksHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },

  remarksTitle: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 5,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },

  remarks: {
    color: '#475569',
    fontSize: 11,
    lineHeight: 17,
  },

  // =========================
  // LOADING
  // =========================

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 60,
  },

  loadingText: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 12,
  },

  // =========================
  // EMPTY / ERROR
  // =========================

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
    paddingBottom: 80,
  },

  emptyIcon: {
    width: 62,
    height: 62,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  emptyTitle: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },

  emptyText: {
    color: '#64748B',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 6,
    maxWidth: 300,
  },

  retryButton: {
    marginTop: 16,
    backgroundColor: '#aa18ea',
    borderRadius: 10,
    paddingHorizontal: 17,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  retryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  emptyCreateButton: {
    marginTop: 17,
    backgroundColor: '#aa18ea',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  emptyCreateText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});

export default styles;