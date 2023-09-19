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
  const [dataMeals, setDataMeals] = useState([]);
  const [dateMeals, setDateMeals] = useState(String);
  const [typeMeals, setTypeMeals] = useState(String);
  const [countMeals, setCountMeals] = useState(0);

  async function handleFetchDataMeals() {
    const response = await AsyncStorage.getItem(
      "@elastri_ticket_gate:registerMeals"
    );

    const dataMeals = response ? JSON.parse(response) : [];

    setDataMeals(dataMeals);
  }

  const searchMeals = (dateMeals: any, typeMeals: any) => {
    const data = dataMeals.filter(
      (value) =>
        value.dataRefeicao === dateMeals && value.tipoDaRefeicao === typeMeals
    );

    const sizeMeals = data.length;

    setCountMeals(sizeMeals);
  };

  useEffect(() => {
    handleFetchDataMeals();
  }, []);

  const generateExcelMeals = () => {
    let wb = xlsx.utils.book_new();
    let ws = xlsx.utils.json_to_sheet(dataMeals);

    xlsx.utils.book_append_sheet(wb, ws, "relatorio_geral", true);

    const base64 = xlsx.write(wb, { type: "base64" });
    const filename = FileSystem.documentDirectory + "Relatorio_Geral.xlsx";
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
          {item.matricula} - {item.nome} - {item.dataRefeicao} -{" "}
          {item.horaRefeicao} - {item.tipoDaRefeicao} - {item.empresa}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.containerText}>
        <TextInput
          style={styles.textDate}
          placeholder="Insira uma data da assinatura DD/MM/AA"
          onChangeText={(val) => setDateMeals(val)}
        />
        <TextInput
          style={styles.textType}
          placeholder="Ex.: 'ASSINATURA_PTS'"
          onChangeText={(val) => setTypeMeals(val)}
        />
      </View>

      <View style={styles.containerButton}>
        <Pressable
          style={styles.buttonBuscar}
          onPress={() => searchMeals(dateMeals, typeMeals)}
        >
          <Text style={styles.text}>Buscar</Text>
        </Pressable>
      </View>

      <SafeAreaView style={styles.containerMeals}>
        <Text style={styles.textQtn}>
          Quantidade de assinatura capturadas na data informada: {countMeals}
        </Text>

        <FlatList
          data={dataMeals}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => renderSnack(item)}
        />
      </SafeAreaView>

      <Pressable style={styles.button} onPress={generateExcelMeals}>
        <Text style={styles.text}>Gerar Relatório de Assinaturas e PTS</Text>
      </Pressable>

      <StatusBar animated={true} backgroundColor="#61dafb" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    flexDirection: "column",

    backgroundColor: "#fff",

    padding: 25,
  },
  containerText: {
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexDirection: "row",

    backgroundColor: "#fff",
  },
  containerButton: {
    justifyContent: "flex-end",

    backgroundColor: "#fff",
  },
  containerMeals: {
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    marginTop: 10,
    height: 250,
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
  buttonBuscar: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "#6FDC8C",
    margin: 10,
    width: 100,
  },
  text: {
    textAlign: "center",
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  textDate: {
    borderColor: "gray",
    width: "50%",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  textType: {
    borderColor: "gray",
    width: "50%",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  textQtn: {
    textAlign: "center",
  },
});
