import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  LogBox,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import SettingsScreen from './screens/SettingsScreen';
import ProfileScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen.js';
import ProductDetailsScreen from './screens/ProductDetailsScreen.js';
import CartScreen from './screens/CartScreen';
import EditCartScreen from './screens/EditCartScreen.js';
import PaymentScreen from './screens/PaymentScreen.js';
import HistoryScreen from './screens/HistoryScreen.js';

import AntDesign from 'react-native-vector-icons/AntDesign';
import Octicons from 'react-native-vector-icons/Octicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

LogBox.ignoreLogs(['EventEmitter.removeListener']);
LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
LogBox.ignoreLogs(['Found Screens with the same name nested']);

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const ProfileStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={'Profile'}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

const HomeStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={'Home'}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
    </Stack.Navigator>
  );
};

const CartStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={'Cart'}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="EditCart" component={EditCartScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
    </Stack.Navigator>
  );
};

const MyTab = () => {
  return (
    <Tab.Navigator
      initialRouteName={'Home'}
      screenOptions={{headerShown: false}}
      tabBarOptions={{
        activeTintColor: 'white',
        activeBackgroundColor: 'black',
        inactiveBackgroundColor: 'black',
        showLabel: false,
      }}>
      <Tab.Screen
        name="Menu"
        component={ProfileScreen}
        options={{
          tabBarIcon: () => {
            return (
              <SimpleLineIcons
                name="menu"
                size={25}
                color={'white'}></SimpleLineIcons>
            );
          },
        }}></Tab.Screen>
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarIcon: () => {
            return (
              <Octicons name="person" size={25} color={'white'}></Octicons>
            );
          },
        }}></Tab.Screen>
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: () => {
            return <Octicons name="home" size={25} color={'white'}></Octicons>;
          },
        }}></Tab.Screen>
      <Tab.Screen
        name="Cart"
        component={CartStack}
        options={{
          tabBarBadge: 0,
          tabBarIcon: () => {
            return (
              <SimpleLineIcons
                name="handbag"
                size={25}
                color={'white'}></SimpleLineIcons>
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
              <AntDesign
                name="clockcircleo"
                size={25}
                color={'white'}></AntDesign>
            );
          },
        }}></Tab.Screen>
    </Tab.Navigator>
  );
};

class MyDrawerComponent extends Component {
  render() {
    return (
      <View style={{flex: 1, backgroundColor: 'black'}}>
        <DrawerContentScrollView {...this.props}>
          <ImageBackground
            style={styles.cover}
            source={{
              uri: 'https://cutewallpaper.org/22/blackpink-4k-wallpapers/1108421717.jpg',
            }}></ImageBackground>
          <View style={{flex: 1, paddingTop: 10}}>
            <DrawerItemList {...this.props} />
          </View>
        </DrawerContentScrollView>
        <View style={styles.border}>
          <TouchableOpacity>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.text}>Log Out</Text>
            </View>
          </TouchableOpacity>
          <Image
            style={styles.logo}
            source={{
              uri: 'https://is4-ssl.mzstatic.com/image/thumb/Purple113/v4/5e/0e/33/5e0e331d-ac1f-8cb3-ed3a-95f3fa591232/source/512x512bb.jpg',
            }}
          />
        </View>
      </View>
    );
  }
}

export default class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <Drawer.Navigator
          drawerContent={props => <MyDrawerComponent {...props} />}
          screenOptions={{
            drawerInactiveTintColor: 'pink',
            drawerActiveTintColor: 'hotpink',
            drawerActiveBackgroundColor: 'black',
            drawerLabelStyle: {
              marginLeft: 10,
              fontSize: 20,
            },
          }}>
          <Drawer.Screen name="BP4U" component={MyTab} />
          <Drawer.Screen name="New Releases" component={HomeScreen} />
          <Drawer.Screen name="On Sale" component={HomeScreen} />
          <Drawer.Screen name="Albums" component={HomeScreen} />
          <Drawer.Screen name="Magazines" component={HomeScreen} />
          <Drawer.Screen name="Fashion" component={HomeScreen} />
          <Drawer.Screen name="Settings" component={SettingsScreen} />
        </Drawer.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  cover: {
    height: 150,
  },
  logo: {
    alignSelf: 'flex-end',
    width: 70,
    height: 70,
    marginLeft: 30,
    borderRadius: 30,
  },
  border: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: 'grey',
  },
  text: {
    fontSize: 20,
    color: 'white',
    marginLeft: 10,
  },
});
