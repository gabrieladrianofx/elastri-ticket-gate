import { StatusBar } from "expo-status-bar";
import { StyleSheet, Button, View, Pressable, Text, Image } from "react-native";

export function Home({ navigation }) {
  function openScreenRegisterCollaborator() {
    navigation.navigate("registerCollaborator");
  }

  function openScreenSnackCoffee() {
    navigation.navigate("snackCoffee");
  }

  function openScreenSnackLunch() {
    navigation.navigate("snackLunch");
  }

  function openScreenSnackSupper() {
    navigation.navigate("snackSupper");
  }

  function openScreenMealReport() {
    navigation.navigate("mealReport");
  }

  return (
    <View style={styles.container}>
      <Image
        style={styles.buttonImage}
        source={require("./../public/images/icon.png")}
      />

      <Pressable style={styles.button} onPress={openScreenRegisterCollaborator}>
        <Text style={styles.text}>Registar Colaboradores</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={openScreenSnackCoffee}>
        <Text style={styles.text}>Registrar Café da Manhã</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={openScreenSnackLunch}>
        <Text style={styles.text}>Registrar Almoços</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={openScreenSnackSupper}>
        <Text style={styles.text}>Registrar Janta</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={openScreenMealReport}>
        <Text style={styles.text}>Relatórios</Text>
      </Pressable>

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
  buttonImage: {
    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#DDDDDD",

    width: 150,
    height: 150,

    bottom: 50,

    padding: 10,
  },
});
