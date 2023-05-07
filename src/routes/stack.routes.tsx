import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Home } from "../screens/Home";
import { SnackCoffee } from "../screens/SnackCoffee";
import { SnackLunch } from "../screens/SnackLunch";
import { MealReport } from "../screens/MealReport";

const { Screen, Navigator } = createNativeStackNavigator();

export function StackRoutes() {
  return (
    <Navigator initialRouteName="home">
      <Screen name="home" component={Home} />
      <Screen name="snackCoffee" component={SnackCoffee} />
      <Screen name="snackLunch" component={SnackLunch} />
      <Screen name="mealReport" component={MealReport} />
    </Navigator>
  );
}
