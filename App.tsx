import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, Button, KeyboardTypeOptions, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import db from './firebaseConfig.js';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

interface TControlInput {
  label: string,
  name: "distance" | "used_fuel",
  keyboardType: KeyboardTypeOptions,
  placeholder: string
}

export default function App() {

  const controls: TControlInput[] = [
    {
      label: "Przejechany dystans:",
      name: "distance",
      keyboardType: "decimal-pad",
      placeholder: "Wprowadź dystans:"
    },
    {
      label: "Zużyte paliwo:",
      name: "used_fuel",
      keyboardType: "decimal-pad",
      placeholder: "Wprowadź paliwo:"
    }
  ]

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
