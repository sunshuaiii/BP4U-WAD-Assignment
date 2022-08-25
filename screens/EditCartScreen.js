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
  Alert
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
      id: this.props.route.params.id, //70001
      cart_id: this.props.route.params.cart_id, //60001
      cartItem: [],
      name:'',
      photo:'',
      price:'',
      cart_id: '',
      product_id: '',
      quantity: '',
      isFetching: false,
    };
    this._loadbyID = this._loadbyID.bind(this);
    this._update = this._update.bind(this);
    this._remove = this._remove.bind(this);
  }

  _loadbyID() {
    let url = config.settings.serverPath + '/api/cart-item/incart/' + this.state.cart_id + '/' + this.state.id;
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
        this.setState({
          cartItem: cartItem,
          name: cartItem.name,
          photo: cartItem.photo,
          price: cartItem.price,
          quantity: cartItem.ci_quantity,
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  _update() {
    console.log(this.state.id);
    let url = config.settings.serverPath + '/api/cart-item/' + this.state.id;
    this.setState({isFetching: true});
    console.log(url);

    fetch(url, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: this.state.id,
        quantity: this.state.quantity,
      }),
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
          Alert.alert('Record UPDATED for', this.state.quantity.toString());
        } else {
          Alert.alert('Error in UPDATING');
        }
      })
      .catch(error => {
        console.log(error);
      });
      this.props.route.params.refresh();
      this.props.navigation.goBack();
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
          let url = config.settings.serverPath + '/api/cart-item/' + this.state.id;
          console.log(url);
          fetch(url, {
            method: 'DELETE',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({id: this.state.id}),
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

  componentDidUpdate() {
    this.props.navigation.setOptions({headerTitle: 'Edit: ' + this.state.id});
  }

  render() {
    return (
      <ScrollView style={{flex: 1, margin: 5}}>
        <View style={{flexDirection: 'row', height: 150}}>
          <View style={{flex: 1}}>
            <Image style={styles.image}>{this.state.image}</Image>
          </View>

          <View style={{flex: 2}}>
            <Text style={styles.itemName}>{this.state.name}</Text>
            <Text style={styles.itemPrice}>{this.state.price}</Text>
            <TextInput
              label={'Quantity'}
              placeholder={'Enter your quantity'}
              value={this.state.quantity}
              onChangeText={quantity => {
                this.setState({quantity});
              }}></TextInput>
          </View>
        </View>
        <AppButton title={'SAVE'} onPress={this._update}></AppButton>
        <AppButton title={'REMOVE'} onPress={this._remove}></AppButton>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    height: 100,
    width: 100,
    margin: 15,
  },

  itemName: {
    margin: 15,
    fontSize: 20,
    color: 'black',
  },

  itemPrice: {
    marginTop: -5,
    margin: 15,
    color: '#FF4023',
    fontSize: 13.5,
  },

  itemQuantity: {
    marginTop: -5,
    margin: 15,
    color: 'black',
    fontSize: 13.5,
  },

  quantityButton: {
    width: 40,
    height: 40,
  },

  removeButton: {
    width: 65,
    height: 30,
    backgroundColor: '#FF9F00',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'black',
    padding: 3,
    marginTop: -10,
    marginLeft: 40,
  },
});
