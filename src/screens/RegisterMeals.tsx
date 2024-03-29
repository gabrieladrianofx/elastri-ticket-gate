import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { BarCodeScanner, Constants } from "expo-barcode-scanner";
import Toast from "react-native-root-toast";

import uuid from "react-native-uuid";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { Audio } from "expo-av";

interface Collaborator {
  matricula: string;
  nome: string;
  empresa: string;
}

interface Meals {
  matricula: string;
  dataAssinatura: string;
  horaAssinatura: string;
  tipoAssinatura: string;
  empresa: string;
}

export function RegisterMeals() {
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
      const sound = new Audio.Sound();

      const colab = {
        id: uuid.v4(),
        matricula: data,
        nome: "undefined",
        dataAssinatura: new Date().toLocaleDateString("pt-BR", {
          timeZone: "America/Sao_Paulo",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
        horaAssinatura: new Date().toLocaleTimeString("pt-BR", {
          timeZone: "America/Sao_Paulo",
          hour: "2-digit",
          minute: "2-digit",
        }),
        tipoAssinatura: "undefined",
        empresa: "undefined",
      };

      const convertDate = colab.dataAssinatura.split("/");
      const correctionDate =
        convertDate[1] + "/" + convertDate[0] + "/" + convertDate[2];

      colab.dataAssinatura = correctionDate;

      const searchMeals = await AsyncStorage.getItem(
        "@elastri_ticket_gate:registerMeals"
      );

      const searchCollaborator = await AsyncStorage.getItem(
        "@elastri_ticket_gate:registerCollaborator"
      );

      const previousMeals: Meals[] = searchMeals ? JSON.parse(searchMeals) : [];

      const previousCollaboratorData: Collaborator[] = searchCollaborator
        ? JSON.parse(searchCollaborator)
        : [];

      if (colab.horaAssinatura > "05:59" && colab.horaAssinatura < "08:00") {
        colab.tipoAssinatura = "ASSINATURA_PDS-E_ORDEM_UNIDA";
        const collaboratorExistOrNot = previousCollaboratorData.find(
          (element) => element.matricula == colab.matricula
        );
        if (collaboratorExistOrNot) {
          const collaboratorMealsOrNot = previousMeals.some(
            (col) =>
              col.matricula == colab.matricula &&
              col.dataAssinatura == colab.dataAssinatura &&
              col.tipoAssinatura == colab.tipoAssinatura
          );
          if (!collaboratorMealsOrNot) {
            colab.empresa = collaboratorExistOrNot.empresa;
            colab.nome = collaboratorExistOrNot.nome;
            const collectionMealsData = [...previousMeals, colab];

            await AsyncStorage.setItem(
              "@elastri_ticket_gate:registerMeals",
              JSON.stringify(collectionMealsData)
            );

            // Toast.show("Café registrado com sucesso 🤝", {
            //   position: 150,
            //   duration: 1500,
            //   backgroundColor: "#6FDC8C",
            //   textColor: "#000000",
            // });
            Toast.show("✅", {
              position: 150,
              duration: 2000,
              textStyle: { fontSize: 200 },
            });
            await sound.loadAsync(require("./../../assets/beep-07a.mp3"));
            await sound.playAsync();
            setTimeout(() => {
              setScanned(false);
            }, 2500);
          } else {
            Toast.show("✋ | Registro encontrado anteriormente!", {
              position: 150,
              duration: 2000,
              backgroundColor: "#ff320c",
              textColor: "#fff",
            });
            await sound.loadAsync(require("./../../assets/beep-30b.mp3"));
            await sound.playAsync();
            setTimeout(() => {
              setScanned(false);
            }, 2500);
          }
        } else {
          Toast.show("Colaborador não cadastrado! ✋", {
            position: 150,
            duration: 2000,
            backgroundColor: "#ff320c",
            textColor: "#fff",
          });
          await sound.loadAsync(require("./../../assets/beep-30b.mp3"));
          await sound.playAsync();
          setTimeout(() => {
            setScanned(false);
          }, 2500);
        }
      } else {
        Toast.show("Desculpe, fora do hórario definido para registro! ⌛", {
          position: 150,
          duration: 2000,
          backgroundColor: "#ff320c",
          textColor: "#000000",
        });
        await sound.loadAsync(require("./../../assets/beep-30b.mp3"));
        await sound.playAsync();
        setTimeout(() => {
          setScanned(false);
        }, 2500);
      }
    } catch (error) {
      Toast.show(
        "Error detectado. Caso o erro persista, contacte um suporte! ✋",
        {
          position: 150,
          duration: Toast.durations.SHORT,
          backgroundColor: "#ff320c",
          textColor: "#000000",
        }
      );
      setTimeout(() => {
        setScanned(false);
      }, 2500);
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
