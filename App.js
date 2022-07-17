import HomeScreen from './HomeScreen';
import AnimalScreen from './AnimalScreen';
import React, {Component} from 'react';
import {StyleSheet, Text} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';

const StackNav = createStackNavigator();
export default class App extends Component<Props> {
  render() {
    return (
      <NavigationContainer>
        <StackNav.Navigator initialRouteName="Home">
          
          <StackNav.Screen
            name="Home"
            component={HomeScreen}
            options={styles.HomeHeader}></StackNav.Screen>
          <StackNav.Screen
            name="Animal"
            component={AnimalScreen}
            options={styles.AnimalHeader}></StackNav.Screen>
        </StackNav.Navigator>
      </NavigationContainer>
    );
  }
}
const styles = StyleSheet.create({
  HomeHeader: {
    title: 'MyHome',
    headerStyle: {
      backgroundColor: '#a80000',
    },
    headerTitleAlign: 'center',
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  },
  AnimalHeader: {
    // title: this.props.route.params.animal.name,
    headerStyle: {
      backgroundColor: '#a80000',
    },
    headerTitleAlign: 'center',
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  },
});
