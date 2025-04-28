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
      label: "Przejechany dystans (km):",
      name: "distance",
      keyboardType: "decimal-pad",
      placeholder: "Wprowadź dystans"
    },
    {
      label: "Zużyte paliwo (l):",
      name: "used_fuel",
      keyboardType: "decimal-pad",
      placeholder: "Wprowadź ilość paliwa"
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
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.title}>Kalkulator spalania paliwa</Text>
        {
          controls.map((item, index) => {
            return <View key={index} style={styles.inputContainer}>
              <Text style={styles.label}>{item.label}</Text>
              <TextInput
                style={styles.input}
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
        <Text style={styles.result}>Średnie spalanie: {fuel_per_100km.toFixed(2)} l/100km</Text>
        <View style={styles.buttonContainer}>
          <Button
            title="Zapisz wynik"
            onPress={() => {
              saveRecord();
            }} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  safeArea: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 15,
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  result: {
    fontSize: 20,
    fontWeight: '600',
    marginVertical: 20,
    color: '#333',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 10,
  },
});
