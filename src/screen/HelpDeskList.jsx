import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import styles from './HelpDeskList.styles';

const API_URL =
  'https://hrexim.tranzol.com/api/HelpDesk/GetHelpDeskList';

const HelpDeskList = ({ navigation }) => {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState('');

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  /**
   * Get employee ID from AsyncStorage
   */
  const getEmployeeId = async () => {
    const details = await AsyncStorage.getItem(
      'employeeDetails',
    );

    if (!details) {
      throw new Error('User id not found.');
    }

    let parsedDetails;

    try {
      parsedDetails = JSON.parse(details);
    } catch (error) {
      console.log(
        'Employee Details Parse Error:',
        error,
      );

      throw new Error(
        'Unable to read employee details.',
      );
    }

    const employeeId = parsedDetails?.EmployeeId;

    if (!employeeId) {
      throw new Error('User id not found.');
    }

    return employeeId;
  };

  /**
   * Get Help Desk tickets
   */
  const fetchTickets = async ({
    isRefresh = false,
  } = {}) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError('');

      const token =
        await AsyncStorage.getItem('access_token');

      if (!token) {
        throw new Error(
          'Your session has expired. Please login again.',
        );
      }

      const employeeId = await getEmployeeId();

      const response = await fetch(
        `${API_URL}?userId=${employeeId}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const res = await response.json();
console.log('api',`${API_URL}?userId=${employeeId}`)
console.log('response',res)
      if (response.status === 401) {
        throw new Error(
          'Your session has expired. Please login again.',
        );
      }

      const responseText = await response.text();

      console.log(
        'GetHelpDeskList Response:',
        responseText,
      );

      if (!response.ok) {
        let message =
          'Unable to load help desk tickets.';

        try {
          const json = JSON.parse(responseText);

          message =
            json?.message ||
            json?.Message ||
            json?.ErrorMsg ||
            message;
        } catch (error) {
          if (responseText) {
            message = responseText;
          }
        }

        throw new Error(message);
      }

      let data = [];

      try {
        data = responseText
          ? JSON.parse(responseText)
          : [];
      } catch (error) {
        throw new Error(
          'Invalid response received from server.',
        );
      }

      if (!Array.isArray(data)) {
        throw new Error(
          'Invalid help desk data received from server.',
        );
      }

      setTickets(data);
    } catch (error) {
      console.log(
        'GetHelpDeskList Error:',
        error,
      );

      setTickets([]);

      if (
        error?.message?.includes(
          'Network request failed',
        )
      ) {
        setError(
          'Unable to connect to the server. Please check your internet connection.',
        );
      } else {
        setError(
          error?.message ||
            'Unable to load help desk tickets.',
        );
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  /**
   * Pull-to-refresh
   */
  const handleRefresh = useCallback(() => {
    fetchTickets({
      isRefresh: true,
    });
  }, []);

  /**
   * Search
   */
  const filteredTickets = useMemo(() => {
    const keyword = search
      .trim()
      .toLowerCase();

    if (!keyword) {
      return tickets;
    }

    return tickets.filter(item => {
      return (
        String(item?.Id || '')
          .toLowerCase()
          .includes(keyword) ||
        String(item?.TicketType || '')
          .toLowerCase()
          .includes(keyword) ||
        String(item?.Descriptions || '')
          .toLowerCase()
          .includes(keyword) ||
        String(item?.Status || '')
          .toLowerCase()
          .includes(keyword) ||
        String(item?.Priority || '')
          .toLowerCase()
          .includes(keyword) ||
        String(item?.ResolveUser || '')
          .toLowerCase()
          .includes(keyword)
      );
    });
  }, [tickets, search]);

  /**
   * Format date
   */
  const formatDate = date => {
    if (!date) {
      return '—';
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return '—';
    }

    return parsedDate.toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      },
    );
  };

  /**
   * Status configuration
   */
  const getStatusConfig = status => {
    switch (
      String(status || '').toLowerCase()
    ) {
      case 'closed':
        return {
          icon: 'check-circle',
          background: '#ECFDF3',
          text: '#15803D',
        };

      case 'resolved':
        return {
          icon: 'check-circle-outline',
          background: '#EFF6FF',
          text: '#aa18ea',
        };

      case 'inprogress':
      case 'in progress':
        return {
          icon: 'progress-clock',
          background: '#FFF7ED',
          text: '#C2410C',
        };

      default:
        return {
          icon: 'progress-clock',
          background: '#F1F5F9',
          text: '#475569',
        };
    }
  };

  /**
   * Priority configuration
   */
  const getPriorityConfig = priority => {
    switch (
      String(priority || '').toLowerCase()
    ) {
      case 'urgent':
        return {
          background: '#FEF2F2',
          text: '#DC2626',
        };

      case 'high':
        return {
          background: '#FFF7ED',
          text: '#EA580C',
        };

      case 'medium':
        return {
          background: '#FEFCE8',
          text: '#CA8A04',
        };

      case 'low':
      default:
        return {
          background: '#F0FDF4',
          text: '#16A34A',
        };
    }
  };

  /**
   * Ticket card
   */
  const renderTicket = ({
    item,
  }) => {
    const statusConfig =
      getStatusConfig(item?.Status);

    const priorityConfig =
      getPriorityConfig(item?.Priority);

    return (
      <View style={styles.ticketCard}>
        {/* Top row */}
        <View style={styles.ticketTopRow}>
          <View style={styles.ticketIdContainer}>
            <View style={styles.ticketIcon}>
              <MaterialCommunityIcons
                name="ticket-confirmation-outline"
                size={19}
                color="#aa18ea"
              />
            </View>

            <View>
              <Text style={styles.ticketNumber}>
                Ticket #{item?.Id}
              </Text>

              <Text style={styles.ticketType}>
                {item?.TicketType ||
                  'General Issue'}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.priorityBadge,
              {
                backgroundColor:
                  priorityConfig.background,
              },
            ]}
          >
            <Text
              style={[
                styles.priorityText,
                {
                  color: priorityConfig.text,
                },
              ]}
            >
              {item?.Priority || 'Low'}
            </Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionLabel}>
            Description
          </Text>

          <Text
            style={styles.description}
            numberOfLines={3}
          >
            {item?.Descriptions ||
              'No description available.'}
          </Text>
        </View>

        {/* Status */}
        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  statusConfig.background,
              },
            ]}
          >
            <MaterialCommunityIcons
              name={statusConfig.icon}
              size={15}
              color={statusConfig.text}
            />

            <Text
              style={[
                styles.statusText,
                {
                  color: statusConfig.text,
                },
              ]}
            >
              {item?.Status || 'Open'}
            </Text>
          </View>

          {item?.ResolveUser ? (
            <View style={styles.resolvedBy}>
              <Ionicons
                name="person-outline"
                size={14}
                color="#64748B"
              />

              <Text
                style={styles.resolvedByText}
                numberOfLines={1}
              >
                {item.ResolveUser}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Dates */}
        <View style={styles.dateContainer}>
          <View style={styles.dateItem}>
            <Text style={styles.dateLabel}>
              Target
            </Text>

            <Text style={styles.dateValue}>
              {formatDate(item?.TargetDate)}
            </Text>
          </View>

          <View style={styles.dateDivider} />

          <View style={styles.dateItem}>
            <Text style={styles.dateLabel}>
              Closed
            </Text>

            <Text style={styles.dateValue}>
              {formatDate(item?.CloseDate)}
            </Text>
          </View>
        </View>

        {/* Close remarks */}
        {item?.CloseRemarks ? (
          <View style={styles.remarksContainer}>
            <View style={styles.remarksHeader}>
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={15}
                color="#64748B"
              />

              <Text style={styles.remarksTitle}>
                Resolution
              </Text>
            </View>

            <Text
              style={styles.remarks}
              numberOfLines={3}
            >
              {item.CloseRemarks}
            </Text>
          </View>
        ) : null}
      </View>
    );
  };

  /**
   * Empty state
   */
  const renderEmpty = () => {
    if (loading) {
      return null;
    }

    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <Ionicons
              name="cloud-offline-outline"
              size={30}
              color="#aa18ea"
            />
          </View>

          <Text style={styles.emptyTitle}>
            Unable to load tickets
          </Text>

          <Text style={styles.emptyText}>
            {error}
          </Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => fetchTickets()}
            activeOpacity={0.8}
          >
            <Ionicons
              name="refresh"
              size={17}
              color="#FFFFFF"
            />

            <Text style={styles.retryText}>
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (search.trim() && tickets.length > 0) {
      return (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <Ionicons
              name="search-outline"
              size={30}
              color="#aa18ea"
            />
          </View>

          <Text style={styles.emptyTitle}>
            No tickets found
          </Text>

          <Text style={styles.emptyText}>
            Try searching with another keyword.
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIcon}>
          <MaterialCommunityIcons
            name="ticket-outline"
            size={30}
            color="#aa18ea"
          />
        </View>

        <Text style={styles.emptyTitle}>
          No tickets yet
        </Text>

        <Text style={styles.emptyText}>
          You haven't created any help desk
          tickets yet.
        </Text>

        <TouchableOpacity
          style={styles.emptyCreateButton}
          onPress={() =>
            navigation.navigate('HelpDesk')
          }
          activeOpacity={0.8}
        >
          <Ionicons
            name="add"
            size={18}   
            color="#FFFFFF"
          />

          <Text
            style={styles.emptyCreateText}
          >
            Create Ticket
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  /**
   * Initial loading
   */
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="#aa18ea"
        />

        <View style={styles.header}>
          <View style={styles.headerTitleContainer}>
            <View style={styles.headerIcon}>
              <MaterialCommunityIcons
                name="headset"
                size={20}
                color="#FFFFFF"
              />
            </View>

            <View>
              <Text style={styles.headerTitle}>
                Help Desk
              </Text>

              <Text
                style={styles.headerSubtitle}
              >
                Your support tickets
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.createButton}
            onPress={() =>
              navigation.navigate('AddIssue')
            }
            activeOpacity={0.8}
          >
            <Ionicons
              name="add"
              size={20}
              color="#aa18ea"
            />

            <Text
              style={styles.createButtonText}
            >
              New
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color="#aa18ea"
          />

          <Text style={styles.loadingText}>
            Loading your tickets...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#aa18ea"
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <View style={styles.headerIcon}>
            <MaterialCommunityIcons
              name="headset"
              size={20}
              color="#FFFFFF"
            />
          </View>

          <View>
            <Text style={styles.headerTitle}>
              Help Desk
            </Text>

            <Text style={styles.headerSubtitle}>
              Your support tickets
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.createButton}
          onPress={() =>
            navigation.navigate('HelpDesk')
          }
          activeOpacity={0.8}
        >
          <Ionicons
            name="add"
            size={20}
            color="#aa18ea"
          />

          <Text style={styles.createButtonText}>
            New
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={19}
            color="#64748B"
          />

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search tickets..."
            placeholderTextColor="#94A3B8"
            style={styles.searchInput}
            returnKeyType="search"
          />

          {search.length > 0 ? (
            <TouchableOpacity
              onPress={() => setSearch('')}
              activeOpacity={0.7}
            >
              <Ionicons
                name="close-circle"
                size={19}
                color="#94A3B8"
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Ticket count */}
      {tickets.length > 0 ? (
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>
            My Tickets
          </Text>

          <Text style={styles.ticketCount}>
            {filteredTickets.length}{' '}
            {filteredTickets.length === 1
              ? 'ticket'
              : 'tickets'}
          </Text>
        </View>
      ) : null}

      <FlatList
        data={filteredTickets}
        keyExtractor={(item, index) =>
          String(item?.Id ?? index)
        }
        renderItem={renderTicket}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          filteredTickets.length === 0
            ? styles.emptyList
            : styles.listContent
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#aa18ea']}
            tintColor="#aa18ea"
          />
        }
      />
    </SafeAreaView>
  );
};

export default HelpDeskList;