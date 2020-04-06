import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Home from './Home';
import Detail from './Detail';
import Cart from './Cart';
const AppNavigator = createStackNavigator(
  {
    Home: Home,
    Detail: Detail,
    Cart: Cart,
  },
  {
    defaultNavigationOptions: {
    headerStyle: {
      backgroundColor: '#f4511e',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
    },
  }
);
export default createAppContainer(AppNavigator);
