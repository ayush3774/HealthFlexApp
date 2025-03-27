import React from 'react';
import {Modal, View, Text, TouchableOpacity, StyleSheet} from 'react-native';

interface RetryModalProps {
  visible: boolean;
  onRetry: () => void;
  errorMessage: string;
  onClose: () => void;
}

const RetryModal: React.FC<RetryModalProps> = ({
  visible,
  onRetry,
  errorMessage,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              alignSelf: 'center',
              width: '60%',
            }}>
            <TouchableOpacity onPress={onRetry} style={styles.retryButton}>
              <Text style={styles.buttonText}>Retry</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#1E1E1E',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
  },
  errorMessage: {
    color: '#FFF',
    fontSize: 18,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: 'grey',
    padding: 12,
    borderRadius: 4,
  },
  closeButton: {
    backgroundColor: 'orange',
    padding: 12,
    borderRadius: 4,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
  },
});

export default RetryModal;
