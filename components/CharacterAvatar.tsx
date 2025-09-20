
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '../styles/commonStyles';

interface CharacterAvatarProps {
  size?: number;
  showMessage?: boolean;
  message?: string;
}

const CharacterAvatar: React.FC<CharacterAvatarProps> = ({ 
  size = 80, 
  showMessage = false, 
  message = "Hi there! Ready to learn math?" 
}) => {
  return (
    <View style={styles.container}>
      <View style={[styles.avatar, { width: size, height: size }]}>
        <Text style={[styles.emoji, { fontSize: size * 0.6 }]}>🤖</Text>
      </View>
      {showMessage && (
        <View style={styles.messageContainer}>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.messageTail} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  avatar: {
    backgroundColor: colors.primary,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0px 4px 12px ${colors.shadow}`,
    elevation: 4,
  },
  emoji: {
    color: colors.backgroundAlt,
  },
  messageContainer: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 15,
    padding: 12,
    marginTop: 10,
    maxWidth: 250,
    position: 'relative',
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 2,
  },
  message: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.text,
    textAlign: 'center',
  },
  messageTail: {
    position: 'absolute',
    top: -8,
    left: '50%',
    marginLeft: -8,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: colors.backgroundAlt,
  },
});

export default CharacterAvatar;
