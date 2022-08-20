import React, {Component} from 'react';
import {TouchableOpacity, LogBox} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator, DrawerActions} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';

import CustomDrawer from './components/CustomDrawer';
import SettingsScreen from './screens/SettingsScreen';
import ProfileScreen from './screens/ProfileScreen';
import HomeScreen from './screens/HomeScreen.js';
import CartScreen from './screens/CartScreen';
import HistoryScreen from './screens/HistoryScreen.js';

import AntDesign from 'react-native-vector-icons/AntDesign';
import Octicons from 'react-native-vector-icons/Octicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

LogBox.ignoreLogs(['EventEmitter.removeListener']);

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const MyDrawer = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{headerShown: false}}
      // onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
    >
      <Drawer.Screen name="SETTINGS" component={SettingsScreen}></Drawer.Screen>
    </Drawer.Navigator>
  );
};

export default class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName={'Home'}
          tabBarOptions={{
            activeTintColor: 'white',
            activeBackgroundColor: 'black',
            inactiveBackgroundColor: 'black',
            showLabel: false,
          }}>
          <Tab.Screen
            name="Menu"
            component={MyDrawer}
            options={{
              tabBarIcon: () => {
                return (
                  <TouchableOpacity>
                    <SimpleLineIcons
                      name="menu"
                      size={25}
                      color={'white'}></SimpleLineIcons>
                  </TouchableOpacity>
                );
              },
            }}></Tab.Screen>
          <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              tabBarIcon: () => {
                return (
                  <TouchableOpacity>
                    <Octicons
                      name="person"
                      size={25}
                      color={'white'}></Octicons>
                  </TouchableOpacity>
                );
              },
            }}></Tab.Screen>
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              tabBarIcon: () => {
                return (
                  <TouchableOpacity>
                    <Octicons name="home" size={25} color={'white'}></Octicons>
                  </TouchableOpacity>
                );
              },
            }}></Tab.Screen>
          <Tab.Screen
            name="Cart"
            component={CartScreen}
            options={{
              tabBarBadge: 0,
              tabBarIcon: () => {
                return (
                  <TouchableOpacity>
                    <SimpleLineIcons
                      name="handbag"
                      size={25}
                      color={'white'}></SimpleLineIcons>
                  </TouchableOpacity>
                );
              },
            }}></Tab.Screen>
          <Tab.Screen
            name="History"
            component={HistoryScreen}
            options={{
              tabBarBadge: 0,
              tabBarIcon: () => {
                return (
                  <TouchableOpacity>
                    <AntDesign
                      name="clockcircleo"
                      size={25}
                      color={'white'}></AntDesign>
                  </TouchableOpacity>
                );
              },
            }}></Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}
