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
      cartItem_sql:[],
      cart_sql:[],
      order_sql:[],
      isFetching: false,
    };
    this._load = this._load.bind(this);

    this.db = SQLite.openDatabase(
      {name: 'bp4udb', createFromLocation: '~bp4u.sqlite'},
      this.openCallback,
      this.errorCallback,
    );
  }

  _load() {
    let url = config.settings.serverPath + '/api/cart-item';
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

  _query(){
    this.db.transaction(tx =>
      tx.executeSql('SELECT product_name, product_price FROM product INNER JOIN cart_item ON product.product.id=cart_item.ci_product_id', [], (tx, results) =>
        this.setState({cartItem_sql: results.rows.raw()}),
      ),
    );
  }

  _queryForCart(){
    this.db.transaction(tx =>
      tx.executeSql('SELECT product_name, product_price FROM product INNER JOIN cart_item ON product.product.id=cart_item.ci_product_id', [], (tx, results) =>
        this.setState({cart_sql: results.rows.raw()}),
      ),
    );
  }

  openCallback() {
    console.log('database open success');
  }
  errorCallback(err) {
    console.log('Error in opening the database: ' + err);
  }

  componentDidMount() {
    this._load();
    this._query();
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
                    {/* <Image
                      source={require('../assets/productImages/bpshirt.jpg')}
                      style={styles.image}></Image> */}
                  </View>

                  <View style={{flex: 2}}>
                    <Text style={styles.itemName}>{item.product_id}</Text>
                    <Text style={styles.itemPrice}>Price: RM 149.99</Text>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={styles.itemQuantity}>
                        Quantity: {item.quantity}
                      </Text>
                      <TouchableOpacity
                        style={styles.editButton}
                        onPress={() =>
                          this.props.navigation.navigate('EditCart', {
                            id: item.id,
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
