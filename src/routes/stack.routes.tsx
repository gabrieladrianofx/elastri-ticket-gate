import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Home } from "../screens/Home";
import { SnackCoffee } from "../screens/SnackCoffee";
import { SnackLunch } from "../screens/SnackLunch";
import { SnackSupper } from "../screens/SnackSupper";
import { MealReport } from "../screens/MealReport";

const { Screen, Navigator } = createNativeStackNavigator();

export function StackRoutes() {
  return (
    <Navigator initialRouteName="inicio">
      <Screen name="inicio" component={Home} options={{ title: "Início" }} />
      <Screen
        name="snackCoffee"
        component={SnackCoffee}
        options={{ title: "Registro do Café da Manhã" }}
      />
      <Screen
        name="snackLunch"
        component={SnackLunch}
        options={{ title: "Registro do Almoço" }}
      />
      <Screen
        name="snackSupper"
        component={SnackSupper}
        options={{ title: "Registro de Janta" }}
      />
      <Screen
        name="mealReport"
        component={MealReport}
        options={{ title: "Relatórios" }}
      />
    </Navigator>
  );
}
