import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  Button,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import {TouchableHighlight, ScrollView} from 'react-native-gesture-handler';
import {color} from 'react-native-reanimated';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import SQLite from 'react-native-sqlite-storage';
import {InputWithLabel, PickerWithLabel, AppButton} from '../UI';

let config = require('../Config');

export default class EditCartScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product_id: this.props.route.params.product_id,
      cart_id: this.props.route.params.cart_id,
      cartItem: [],
      quantity: '',
      isFetching: false,
    };
    this._loadbyID = this._loadbyID.bind(this);
    this._update = this._update.bind(this);
    this._remove = this._remove.bind(this);
  }

  _loadbyID() {
    let url =
      config.settings.serverPath +
      '/api/cart-item/incart/' +
      this.state.cart_id +
      '/' +
      this.state.product_id;
    console.log(url);
    this.setState({isFetching: true});
    fetch(url)
      .then(response => {
        console.log(response);
        if (!response.ok) {
          Alert.alert('Error: ', response.status.toString());
          throw Error('Error' + response.status);
        }
        this.setState({isFetching: false});
        return response.json();
      })
      .then(cartItem => {
        console.log(cartItem);
        this.setState({cartItem: cartItem});
      })
      .catch(error => {
        console.log(error);
      });
  }

  _update() {
    let url =
      config.settings.serverPath +
      '/api/cart-item/update-quantity/id/' +
      this.state.cartItem.map(c => c.id).toString() +
      '/' +
      this.state.quantity;

    fetch(url, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })
      .then(response => {
        console.log(response);
        if (!response.ok) {
          Alert.alert('Error:', response.status.toString());
          throw Error('Error ' + response.status);
        }

        return response.json();
      })
      .then(respondJson => {
        if (respondJson.affected > 0) {
          Alert.alert('Item quantity updated!');
        } else {
          Alert.alert('Error in UPDATING');
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  _remove() {
    Alert.alert('Confirm to DELETE', this.state.id, [
      {
        text: 'No',
        onPress: () => {},
      },
      {
        text: 'Yes',
        onPress: () => {
          let url =
            config.settings.serverPath +
            '/api/cart-item/' +
            this.state.cartItem.map(c => c.id).toString();
          console.log(url);
          fetch(url, {
            method: 'DELETE',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: this.state.cartItem.map(c => c.id).toString(),
            }),
          })
            .then(response => {
              if (!response.ok) {
                Alert.alert('Error:', response.status.toString());
                throw Error('Error ' + response.status);
              }
              return response.json();
            })
            .then(responseJson => {
              if (responseJson.affected == 0) {
                Alert.alert('Error in DELETING');
              } else {
                Alert.alert('Item removed from your cart!');
              }
            })
            .catch(error => {
              console.error(error);
            });
          this.props.route.params.refresh();
          this.props.navigation.goBack();
        },
      },
    ]);
  }

  componentDidMount() {
    this._loadbyID();
  }

  render() {
    let path = this.state.cartItem.map(c => c.photo).toString();
    console.log(path);
    return (
      <View style={styles.container}>
        <ScrollView style={{padding: 10}}>
          <FlatList
            style={{marginBottom: 50}}
            refreshing={this.state.isFetching}
            onRefresh={this._loadbyID}
            data={this.state.cartItem}
            renderItem={({item}) => {
              return (
                <View style={{flexDirection: 'row', height: 150}}>
                  <View style={{flex: 1}}>
                    <Image style={styles.image} source={{uri: path}}></Image>
                  </View>

                  <View style={{flex: 2}}>
                    <Text style={styles.itemName}>
                      {this.state.cartItem.map(c => c.name)}
                    </Text>
                    <Text style={styles.itemPrice}>
                      RM {this.state.cartItem.map(c => c.price)}
                    </Text>
                  </View>
                </View>
              );
            }}></FlatList>
          <View style={styles.input}>
            <Text> Quantity: {this.state.cartItem.map(c => c.quantity)}</Text>
            <TextInput
              style={{fontSize: 20}}
              placeholder={'Enter your quantity'}
              value={this.state.cartItem.map(c => c.quantity)}
              onChangeText={quantity => {
                this.setState({quantity: quantity});
              }}></TextInput>
          </View>
          <AppButton title={'SAVE'} onPress={this._update}></AppButton>
          <AppButton title={'REMOVE'} onPress={this._remove}></AppButton>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'pink',
    padding: 16,
  },
  image: {
    height: 110,
    width: 110,
    margin: 15,
  },

  itemName: {
    margin: 20,
    fontSize: 20,
    color: 'black',
  },

  itemPrice: {
    marginTop: -5,
    margin: 20,
    color: '#FF4023',
    fontSize: 18,
  },
  input: {
    marginTop: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
    color: '#FF4023',
    borderWidth: 1,
    padding: 5,
    marginHorizontal: 50,
    backgroundColor: 'mistyrose',
  },
});
