import {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Timer} from './types';

export const useTimers = () => {
  const [timers, setTimers] = useState<Timer[]>([]);
  const [modalData, setModalData] = useState<{
    visible: boolean;
    message: string;
  }>({
    visible: false,
    message: '',
  });

  const updateTimerProgress = async (id: number) => {
    setTimers(prevTimers =>
      prevTimers.map(timer => {
        if (timer.id === id && timer.remainingTime > 0) {
          const updatedTime = timer.remainingTime - 1;

          // Trigger halfway alert
          if (updatedTime === Math.ceil(timer.duration / 2)) {
            setModalData({
              visible: true,
              message: `Halfway alert for "${timer.name}"!`,
            });
          }

          // Trigger completion alert
          if (updatedTime === 0) {
            logCompletedTimer(timer);
            setModalData({
              visible: true,
              message: `Timer "${timer.name}" has completed!`,
            });
          }

          return {
            ...timer,
            remainingTime: updatedTime,
            progress: updatedTime / timer.duration,
          };
        }
        return timer;
      }),
    );
  };

  const logCompletedTimer = async (timer: Timer) => {
    const completedTimer = {
      ...timer,
      completionTime: new Date().toLocaleString(),
    };
    try {
      const data = await AsyncStorage.getItem('completedTimers');
      const logs = data ? JSON.parse(data) : [];
      logs.push(completedTimer);
      await AsyncStorage.setItem('completedTimers', JSON.stringify(logs));
    } catch (error) {
      console.error('Failed to save completed timer:', error);
    }
  };

  const addTimer = (name: string, duration: number, category: string) => {
    const newTimer: Timer = {
      id: Date.now(),
      name,
      duration,
      remainingTime: duration,
      progress: 1,
      status: 'idle',
      category,
    };
    setTimers(prev => [...prev, newTimer]);
  };

  const startTimer = (id: number) => {
    setTimers(prevTimers =>
      prevTimers.map(timer =>
        timer.id === id ? {...timer, status: 'running'} : timer,
      ),
    );
  };

  const pauseTimer = (id: number) => {
    setTimers(prevTimers =>
      prevTimers.map(timer =>
        timer.id === id ? {...timer, status: 'paused'} : timer,
      ),
    );
  };

  const resetTimer = (id: number) => {
    setTimers(prevTimers =>
      prevTimers.map(timer =>
        timer.id === id
          ? {
              ...timer,
              remainingTime: timer.duration,
              progress: 1,
              status: 'idle',
            }
          : timer,
      ),
    );
  };

  const hideModal = () => {
    setModalData({visible: false, message: ''});
  };

  return {
    timers,
    modalData,
    addTimer,
    startTimer,
    pauseTimer,
    resetTimer,
    updateTimerProgress,
    hideModal,
  };
};
