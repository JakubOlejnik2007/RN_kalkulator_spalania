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

  const [formData, setFormData] = useState<{
    distance: string,
    used_fuel: string
  }>({
    distance: "100.0",
    used_fuel: ""
  })

  const [fuel_per_100km, setFuel_per_100km] = useState<number>(0);

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

  const calculateFuelConsumption = (formData: { distance: string, used_fuel: string }) => {
    const { distance, used_fuel } = formData;
    if (distance && used_fuel) {
      setFuel_per_100km(parseFloat(used_fuel) / parseFloat(distance) * 100);
    }
  }

  const saveRecord = async () => {
    const spalanieRef = collection(db, 'spalanie');
    await addDoc(spalanieRef, {
      ate: serverTimestamp(),
      distance: formData.distance,
      used_fuel: formData.used_fuel,
      fuel_per_100km: fuel_per_100km,
    });
    Alert.alert("Zapisano rekord");
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <SafeAreaView>
        <Text>Kalkulator spalania</Text>
        {
          controls.map((item, index) => {
            return <View key={index}>
              <Text>{item.label}</Text>
              <TextInput
                placeholder={item.placeholder}
                value={formData[item.name]}
                keyboardType={item.keyboardType}
                onChangeText={(text) => {
                  const updatedFormData = {
                    ...formData,
                    [item.name]: text
                  };
                  setFormData(updatedFormData);
                  calculateFuelConsumption(updatedFormData);
                }}
              />
            </View>
          })
        }
        <Text>Spalanie na 100km: {fuel_per_100km.toFixed(2)} l</Text>
        <Button
          title="Zapisz"
          onPress={() => {
            saveRecord();
          }} />
      </SafeAreaView>
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
