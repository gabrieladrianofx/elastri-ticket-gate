import { View, Text, StyleSheet } from "react-native";

export function RegisterCollaborator() {
  return (
    <View style={styles.container}>
      <Text>Aqui Sera Registrado os Colaboradores via excel</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
});
