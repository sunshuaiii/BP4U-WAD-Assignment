import React, {Component} from 'react';
import {StyleSheet, Image, Text, View} from 'react-native';

const animals = {
  Chicken: {
    name: 'Chicken_title',
    image: require('./img/chicken.png'),
  },
  Duck: {
    name: 'Duck_title',
    image: require('./img/duck.png'),
  },
};

export default class AnimalScreen extends Component<Props> {
  render() {
    let animal = this.props.route.params.animal;
    this.props.navigation.setOptions({
      title: animals[this.props.route.params.animal].name,
    });
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{animals[animal].name}</Text>
        <Image style={styles.image} source={animals[animal].image} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 20,
  },
  image: {
    width: 360,
    height: 360,
  },
});
