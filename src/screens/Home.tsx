import { StatusBar } from "expo-status-bar";
import { StyleSheet, Button, View, Pressable, Text, Image } from "react-native";

export function Home({ navigation }) {
  function openScreenRegisterCollaborator() {
    navigation.navigate("registerCollaborator");
  }

  function openScreenRegisterMeals() {
    navigation.navigate("registerMeals");
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
        <Text style={styles.text}>Registrar Colaboradores</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={openScreenRegisterMeals}>
        <Text style={styles.text}>Registrar Refeições</Text>
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
