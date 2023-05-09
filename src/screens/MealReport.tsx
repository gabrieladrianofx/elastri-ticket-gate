import { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";

import * as xlsx from "xlsx";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

import AsyncStorage from "@react-native-async-storage/async-storage";

export function MealReport() {
  const [dataCoffee, setDataCoffee] = useState([]);
  const [dataLunch, setDataLunch] = useState([]);
  const [dataSupper, setDataSupper] = useState([]);
  const [countCoffee, setCountCoffee] = useState(0);
  const [countLunch, setCountLunch] = useState(0);
  const [countSupper, setCountSupper] = useState(0);

  async function handleFetchDataCoffee() {
    const response = await AsyncStorage.getItem(
      "@elastri_ticket_gate:snackCoffee"
    );

    const dataCoffee = response ? JSON.parse(response) : [];

    setDataCoffee(dataCoffee);
  }

  async function handleFetchDataLunch() {
    const response = await AsyncStorage.getItem(
      "@elastri_ticket_gate:snackLunch"
    );

    const dataLunch = response ? JSON.parse(response) : [];

    setDataLunch(dataLunch);
  }

  async function handleFetchDataSupper() {
    const response = await AsyncStorage.getItem(
      "@elastri_ticket_gate:snackSupper"
    );

    const dataSupper = response ? JSON.parse(response) : [];

    setDataSupper(dataSupper);
  }

  function searchCoffee(dateCoffee) {
    const data = dataCoffee.filter(
      (value) => value.dataRefeicao === dateCoffee
    );

    const sizeCoffee = data.length;

    setCountCoffee(sizeCoffee);
  }

  function searchLunch(dateLunch) {
    const data = dataLunch.filter((value) => value.dataRefeicao === dateLunch);

    const sizeLunch = data.length;

    setCountLunch(sizeLunch);
  }

  function searchSupper(dateSupper) {
    const data = dataSupper.filter(
      (value) => value.dataRefeicao === dateSupper
    );

    const sizeSupper = data.length;

    setCountSupper(sizeSupper);
  }

  useEffect(() => {
    handleFetchDataCoffee();
    handleFetchDataLunch();
    handleFetchDataSupper();
  }, []);

  const generateExcelCoffee = () => {
    let wb = xlsx.utils.book_new();
    let ws = xlsx.utils.json_to_sheet(dataCoffee);

    xlsx.utils.book_append_sheet(wb, ws, "relatorio_cafe", true);

    const base64 = xlsx.write(wb, { type: "base64" });
    const filename = FileSystem.documentDirectory + "RelatorioCafe.xlsx";
    FileSystem.writeAsStringAsync(filename, base64, {
      encoding: FileSystem.EncodingType.Base64,
    }).then(() => {
      Sharing.shareAsync(filename);
    });
  };

  const generateExcelLunch = () => {
    let wb = xlsx.utils.book_new();
    let ws = xlsx.utils.json_to_sheet(dataLunch);

    xlsx.utils.book_append_sheet(wb, ws, "relatorio_almoco", true);

    const base64 = xlsx.write(wb, { type: "base64" });
    const filename = FileSystem.documentDirectory + "RelatorioAlmoco.xlsx";
    FileSystem.writeAsStringAsync(filename, base64, {
      encoding: FileSystem.EncodingType.Base64,
    }).then(() => {
      Sharing.shareAsync(filename);
    });
  };

  const generateExcelSupper = () => {
    let wb = xlsx.utils.book_new();
    let ws = xlsx.utils.json_to_sheet(dataSupper);

    xlsx.utils.book_append_sheet(wb, ws, "relatorio_janta", true);

    const base64 = xlsx.write(wb, { type: "base64" });
    const filename = FileSystem.documentDirectory + "RelatorioJanta.xlsx";
    FileSystem.writeAsStringAsync(filename, base64, {
      encoding: FileSystem.EncodingType.Base64,
    }).then(() => {
      Sharing.shareAsync(filename);
    });
  };

  function renderSnack(item) {
    return (
      <View>
        <Text>
          MATRÍCULA: {item.matricula} - {item.dataRefeicao}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.containerCoffee}>
        <TextInput
          placeholder="Insira uma data do café da manhã DD/MM/AAAA"
          onChangeText={(val) => searchCoffee(val)}
        />

        <Text>Quantidade de café da manhã servidas: {countCoffee}</Text>

        <FlatList
          data={dataCoffee}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => renderSnack(item)}
        />
      </SafeAreaView>

      <SafeAreaView style={styles.containerLunch}>
        <TextInput
          placeholder="Insira uma data do almoço DD/MM/AAAA"
          onChangeText={(val) => searchLunch(val)}
        />

        <Text>Quantidade de almoços servidos: {countLunch}</Text>
        <FlatList
          data={dataLunch}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => renderSnack(item)}
        />
      </SafeAreaView>

      <SafeAreaView style={styles.containerSupper}>
        <TextInput
          placeholder="Insira uma data da janta DD/MM/AAAA"
          onChangeText={(val) => searchSupper(val)}
        />

        <Text>Quantidade de jantas servidas: {countSupper}</Text>
        <FlatList
          data={dataSupper}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => renderSnack(item)}
        />
      </SafeAreaView>

      <Pressable style={styles.button} onPress={generateExcelCoffee}>
        <Text style={styles.text}>Gerar Relatorio Café da Manhã</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={generateExcelLunch}>
        <Text style={styles.text}>Gerar Relatorio Almoço</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={generateExcelSupper}>
        <Text style={styles.text}>Gerar Relatorio Janta</Text>
      </Pressable>

      <StatusBar animated={true} backgroundColor="#61dafb" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "column",

    backgroundColor: "#fff",

    padding: 25,
  },
  containerCoffee: {
    marginBottom: 10,
    height: 150,
  },
  containerLunch: {
    height: 150,
    marginBottom: 10,
  },
  containerSupper: {
    height: 150,
    marginBottom: 10,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "#6FDC8C",
    margin: 10,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});
