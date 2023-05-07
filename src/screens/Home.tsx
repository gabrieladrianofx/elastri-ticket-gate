import { StatusBar } from "expo-status-bar";
import { StyleSheet, Button, View } from "react-native";

export function Home({ navigation }) {
  function openScreenSnackCoffee() {
    navigation.navigate("snackCoffee");
  }

  function openScreenSnackLunch() {
    navigation.navigate("snackLunch");
  }

  function openScreenMealReport() {
    navigation.navigate("mealReport");
  }

  return (
    <View style={styles.container}>
      <Button title="Registrar café da manhã" onPress={openScreenSnackCoffee} />
      <Button title="Registrar almoço" onPress={openScreenSnackLunch} />
      <Button title="Relatório" onPress={openScreenMealReport} />

      <StatusBar animated={true} backgroundColor="#61dafb" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
