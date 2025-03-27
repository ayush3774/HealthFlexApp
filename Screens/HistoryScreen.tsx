import React, {useEffect, useState} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {Text, Card, Divider, useTheme} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Timer} from '../Service/types';

const HistoryScreen = () => {
  const [completedTimers, setCompletedTimers] = useState<Timer[]>([]);
  const theme = useTheme();

  useEffect(() => {
    const fetchCompletedTimers = async () => {
      try {
        const data = await AsyncStorage.getItem('completedTimers');
        if (data) {
          setCompletedTimers(JSON.parse(data));
        }
      } catch (error) {
        console.error('Failed to fetch completed timers:', error);
      }
    };

    fetchCompletedTimers();
  }, []);

  const renderTimer = ({item}: {item: Timer}) => (
    <Card style={[styles.timerCard, {backgroundColor: theme.colors.surface}]}>
      <Card.Content>
        <Text variant="titleMedium" style={{color: theme.colors.onSurface}}>
          {item.name}
        </Text>
        <Text style={{color: theme.colors.onSurface}}>
          Completed At: {item.completionTime}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Text
        variant="headlineSmall"
        style={[styles.header, {color: theme.colors.primary}]}>
        Timer History
      </Text>
      <Divider style={styles.divider} />
      <FlatList
        data={completedTimers}
        renderItem={renderTimer}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={
          <Text
            style={{
              color: theme.colors.onSurface,
              textAlign: 'center',
              marginTop: 20,
            }}>
            No completed timers yet.
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    textAlign: 'center',
    marginBottom: 12,
  },
  divider: {
    marginBottom: 12,
    height: 1,
  },
  timerCard: {
    marginVertical: 8,
    borderRadius: 8,
  },
});

export default HistoryScreen;
