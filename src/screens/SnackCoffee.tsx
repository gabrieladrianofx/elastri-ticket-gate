import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  Button,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { BarCodeScanner, Constants } from "expo-barcode-scanner";

import uuid from "react-native-uuid";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";

export function SnackCoffee() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [type, setType] = useState(Constants.Type.back);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = async ({ data }) => {
    try {
      setScanned(true);

      const colab = {
        id: uuid.v4(),
        matricula: data,
        dataRefeicao: new Date().toLocaleString("pt-BR", {
          timeZone: "UTC",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
      };

      const response = await AsyncStorage.getItem(
        "@elastri_ticket_gate:snackCoffee"
      );
      const previousData = response ? JSON.parse(response) : [];

      const collectionData = [...previousData, colab];

      await AsyncStorage.setItem(
        "@elastri_ticket_gate:snackCoffee",
        JSON.stringify(collectionData)
      );

      Alert.alert("Sucesso", "Café da manhã registrado com sucesso 🤝");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Refeição não cadastrada! ✋");
    }
  };

  function toggleCameraType() {
    setType((current) =>
      current === Constants.Type.back
        ? Constants.Type.front
        : Constants.Type.back
    );
  }

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        type={type}
        style={StyleSheet.absoluteFillObject}
        barCodeTypes={BarCodeScanner.Constants.BarCodeType.qr}
      />

      <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
        <Image
          style={styles.buttonImage}
          source={require("./../public/images/camera.png")}
        />
      </TouchableOpacity>

      {scanned && (
        <Button
          title={"Deseja Cadastrar Nova Refeição ❓"}
          onPress={() => setScanned(false)}
        />
      )}

      <StatusBar animated={true} backgroundColor="#61dafb" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#fff",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#DDDDDD",

    top: -250,
    left: 160,

    width: 50,
    height: 50,
    borderRadius: 50,
    padding: 10,
  },
  buttonImage: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
  },
});
