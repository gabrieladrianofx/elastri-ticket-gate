import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Home } from "../screens/Home";
import { RegisterCollaborator } from "../screens/RegisterCollaborator";
import { RegisterMeals } from "../screens/RegisterMeals";
import { MealReport } from "../screens/MealReport";

const { Screen, Navigator } = createNativeStackNavigator();

export function StackRoutes() {
  return (
    <Navigator initialRouteName="inicio">
      <Screen name="inicio" component={Home} options={{ title: "Início" }} />
      <Screen
        name="registerCollaborator"
        component={RegisterCollaborator}
        options={{ title: "Registro de Colaboradores" }}
      />
      <Screen
        name="registerMeals"
        component={RegisterMeals}
        options={{ title: "Registrar Refeições" }}
      />

      <Screen
        name="mealReport"
        component={MealReport}
        options={{ title: "Relatórios" }}
      />
    </Navigator>
  );
}
