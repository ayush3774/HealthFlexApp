import React, {useEffect, useState} from 'react';
import {View, FlatList, StyleSheet, ScrollView} from 'react-native';
import {useTimers} from '../Service/useTimers';
import {Timer} from '../Service/types';
import {
  ProgressBar,
  Button,
  Card,
  Text,
  List,
  useTheme,
  Divider,
  Portal,
  Modal,
  TextInput,
} from 'react-native-paper';

const HomeScreen = ({navigation}: {navigation: any}) => {
  const {
    timers,
    addTimer,
    startTimer,
    pauseTimer,
    resetTimer,
    updateTimerProgress,
    modalData,
    hideModal,
  } = useTimers();

  const theme = useTheme();
  const [newTimerName, setNewTimerName] = useState('');
  const [newTimerCategory, setNewTimerCategory] = useState('');
  const [selectedDuration, setSelectedDuration] = useState<number>(60); // Default to 60 seconds
  const [categories, setCategories] = useState<string[]>([]); // Store user-defined categories

  useEffect(() => {
    const interval = setInterval(() => {
      timers.forEach(timer => {
        if (timer.status === 'running') {
          updateTimerProgress(timer.id);
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timers]);

  const groupedTimers = timers.reduce(
    (acc: {[key: string]: Timer[]}, timer: Timer) => {
      if (!acc[timer.category]) {
        acc[timer.category] = [];
      }
      acc[timer.category].push(timer);
      return acc;
    },
    {},
  );

  const renderTimer = ({item}: {item: Timer}) => (
    <Card style={[styles.timerCard, {backgroundColor: theme.colors.surface}]}>
      <Card.Content>
        <Text variant="titleMedium" style={{color: theme.colors.onSurface}}>
          {item.name}
        </Text>
        <ProgressBar
          progress={item.progress}
          color={theme.colors.primary}
          style={styles.progressBar}
        />
        <Text style={{color: theme.colors.onSurface}}>
          Remaining Time: {item.remainingTime}s
        </Text>
        <View style={styles.timerControls}>
          <Button
            mode="contained-tonal"
            onPress={() => startTimer(item.id)}
            style={styles.controlButton}>
            Start
          </Button>
          <Button
            mode="contained-tonal"
            onPress={() => pauseTimer(item.id)}
            style={styles.controlButton}>
            Pause
          </Button>
          <Button
            mode="contained-tonal"
            onPress={() => resetTimer(item.id)}
            style={styles.controlButton}>
            Reset
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  const renderCategory = (category: string) => (
    <View style={styles.category}>
      <Text
        variant="titleLarge"
        style={[styles.categoryTitle, {color: theme.colors.primary}]}>
        {category}
      </Text>
      <Divider style={styles.divider} />
      <FlatList
        data={groupedTimers[category]}
        renderItem={renderTimer}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      {/* Input for Timer Name */}
      <TextInput
        mode="outlined"
        label="Timer Name"
        placeholder="Enter timer name"
        value={newTimerName}
        onChangeText={setNewTimerName}
        style={styles.textInput}
      />
      {/* Input for Timer Category */}
      <TextInput
        mode="outlined"
        label="Category"
        placeholder="Enter or select a category"
        value={newTimerCategory}
        onChangeText={setNewTimerCategory}
        style={styles.textInput}
        onBlur={() => {
          if (newTimerCategory && !categories.includes(newTimerCategory)) {
            setCategories([...categories, newTimerCategory]); // Add new category
          }
        }}
      />
      {/* Duration Selection with Horizontal Scroll */}
      <View style={styles.durationContainer}>
        <Text style={[styles.label, {color: theme.colors.onSurface}]}>
          Select Duration:
        </Text>
        <ScrollView horizontal contentContainerStyle={styles.durationButtons}>
          {[30, 60, 120, 300].map(duration => (
            <Button
              key={duration}
              mode={selectedDuration === duration ? 'contained' : 'outlined'}
              onPress={() => setSelectedDuration(duration)}
              style={styles.durationButton}>
              {duration / 60} min
            </Button>
          ))}
        </ScrollView>
      </View>
      <Button
        mode="contained"
        onPress={() => {
          if (newTimerName.trim() && newTimerCategory.trim()) {
            addTimer(
              newTimerName.trim(),
              selectedDuration,
              newTimerCategory.trim(),
            );
            setNewTimerName('');
            setNewTimerCategory('');
          } else {
            alert('Please enter a valid timer name and category.');
          }
        }}
        style={styles.addButton}>
        Add Timer
      </Button>
      <FlatList
        data={Object.keys(groupedTimers)}
        renderItem={({item}) => renderCategory(item)}
        keyExtractor={item => item}
      />
      <Button
        mode="outlined"
        onPress={() => navigation.navigate('History')}
        style={styles.viewHistoryButton}>
        View History
      </Button>

      {/* Modal for halfway and completion alerts */}
      <Portal>
        <Modal
          visible={modalData.visible}
          onDismiss={hideModal}
          contentContainerStyle={[
            styles.modalContainer,
            {backgroundColor: theme.colors.surface},
          ]}>
          <Text style={{color: theme.colors.onSurface}}>
            {modalData.message}
          </Text>
          <Button
            mode="contained"
            onPress={hideModal}
            style={styles.controlButton}>
            OK
          </Button>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  textInput: {
    marginBottom: 16,
    height: 35,
  },
  addButton: {
    marginBottom: 16,
  },
  viewHistoryButton: {
    marginTop: 16,
  },
  timerCard: {
    marginVertical: 8,
    borderRadius: 8,
  },
  progressBar: {
    marginVertical: 8,
    height: 8,
    borderRadius: 4,
  },
  timerControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  controlButton: {
    marginHorizontal: 4,
  },
  category: {
    marginBottom: 20,
  },
  categoryTitle: {
    marginBottom: 8,
  },
  divider: {
    marginBottom: 12,
    height: 1,
  },
  modalContainer: {
    padding: 20,
    margin: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  durationContainer: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
  },
  durationButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-start', // Align buttons to the left
  },
  durationButton: {
    marginHorizontal: 4,
  },
});

export default HomeScreen;
