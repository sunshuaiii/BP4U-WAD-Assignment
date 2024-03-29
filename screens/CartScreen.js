import React, {Component} from 'react';
import {
  View,
  Text,
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

export default class CartScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cartItem: [],
      cart_id: "60001",
      isFetching: false,
    };
    this._load = this._load.bind(this);
  }

  _load() {
    let url = config.settings.serverPath + '/api/cart-item/incart/' + this.state.cart_id;
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
        this.setState({cartItem: cartItem});
        console.log(cartItem);
      })
      .catch(error => {
        console.log(error);
      });
  }

  componentDidMount() {
    this._load();
  }

  render() {
    return (
      <View>
        <FlatList
          refreshing={this.state.isFetching}
          onRefresh={this._load}
          data={this.state.cartItem}
          renderItem={({item}) => {
            return (
              <ScrollView style={{marginbottom: 80}}>
                <View style={{flexDirection: 'row', height: 150}}>
                  <View style={{flex: 1}}>
                    <Image
                      source={{uri: item.photo}}
                      style={styles.image}></Image>
                  </View>

                  <View style={{flex: 2}}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemPrice}>RM {item.price}</Text>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={styles.itemQuantity}>
                        Quantity: {item.quantity}
                      </Text>
                      <TouchableOpacity
                        style={styles.editButton}
                        onPress={() =>
                          this.props.navigation.navigate('EditCart', {
                            cart_id: this.state.cart_id,
                            product_id: item.id, //cart_item_id
                            refresh: this._load,
                          })
                        }>
                        <Text style={{color: 'black'}}>Edit Cart</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </ScrollView>
            );
          }}></FlatList>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() =>
            this.props.navigation.navigate('Payment', {
              id: this.state.cart_id,
              refresh:this._load,
            })
          }
          >
          <View style = {styles.floatingButton}>
            <Text style = {{color:'black'}}>CHECK OUT</Text>
          </View>
        </TouchableOpacity>
      </View>
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

  editButton: {
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

  checkoutButton: {
    position: 'absolute',
    width: 150,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    right: 0,
    top: 585,
    backgroundColor: 'pink',
  },

  floatingButton: {
    alignItems: 'center',
    width: 100,
    heigh: 30,
  },
});
