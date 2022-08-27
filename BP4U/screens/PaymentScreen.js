import React, {Component, useEffect, useState, useContext} from 'react';
import {
  Text,
  Image,
  View,
  ScrollView,
  Button,
  Alert,
  StyleSheet,
  TextInput,
  FlatList,
} from 'react-native';
import {AppButton} from '../UI';
import SQLite from 'react-native-sqlite-storage';
import RadioGroup, {RadioButtonProps} from 'react-native-radio-buttons-group';

let config = require('../Config');

export default class PaymentScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cart_id: this.props.route.params.id,
      memberid: '10001',
      member: [],
      cartItem: [],
      shippingAddress: '',
      totalWeight: [],
      total: [],
      name: '',
      contact: '',
      orderId: [],
      isFetching: false,
    };
    this._loadMemberDetails = this._loadMemberDetails.bind(this);
    this._loadOrderDetails = this._loadOrderDetails.bind(this);
    this._loadSubtotal = this._loadSubtotal.bind(this);
    this._loadTotalWeight = this._loadTotalWeight.bind(this);
    this.placeOrder = this.placeOrder.bind(this);
    this._saveOrderRecord = this._saveOrderRecord.bind(this);
    this._getOrderId = this._getOrderId.bind(this);
    this._saveOrderItemRecord = this._saveOrderItemRecord.bind(this);
    this._updateStock = this._updateStock.bind(this);
    this._removeCartItem = this._removeCartItem.bind(this);
    this._savePaymentRecord = this._savePaymentRecord.bind(this);
  }

  _loadMemberDetails() {
    let url = config.settings.serverPath + '/api/member/' + this.state.memberid;
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
      .then(member => {
        this.setState({member: member});
        console.log(member);
      })
      .catch(error => {
        console.log(error);
      });
  }

  _loadOrderDetails() {
    let url =
      config.settings.serverPath +
      '/api/cart-item/incart/weight/' +
      this.state.cart_id;
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

  _loadSubtotal() {
    let url =
      config.settings.serverPath + '/api/cart/cart-total/' + this.state.cart_id;
    console.log(url);
    fetch(url)
      .then(response => {
        if (!response.ok) {
          Alert.alert('Error:', response.status.toString());
          throw Error('Error ' + response.status);
        }
        return response.json();
      })
      .then(total => {
        this.setState({total: total});
      })
      .catch(error => {
        console.error(error);
      });
  }

  _loadTotalWeight() {
    let url =
      config.settings.serverPath +
      '/api/cart/total-weight/' +
      this.state.cart_id;
    console.log(url);
    fetch(url)
      .then(response => {
        if (!response.ok) {
          Alert.alert('Error:', response.status.toString());
          throw Error('Error ' + response.status);
        }
        return response.json();
      })
      .then(totalWeight => {
        this.setState({totalWeight: totalWeight});
      })
      .catch(error => {
        console.error(error);
      });
  }

  _saveOrderRecord() {
    let url = config.settings.serverPath + '/api/order';

    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        member_id: this.state.memberid,
        ship_address: this.state.shippingAddress,
        ship_fee: Math.ceil(this.state.totalWeight.total).toFixed(2) * 5,
        total: this.state.total.total,
        status: 'PAID',
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
          Alert.alert('Order has been placed!');
        } else {
          Alert.alert('Error in SAVING');
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  _saveOrderItemRecord(product_id, quantity) {
    let url = config.settings.serverPath + '/api/order-item';

    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order_id: this.state.orderId.id,
        product_id: product_id,
        quantity: quantity,
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
        } else {
          Alert.alert('Error in SAVING');
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  _getOrderId() {
    let url = config.settings.serverPath + '/api/order/getId';
    console.log(url);
    fetch(url)
      .then(response => {
        console.log(response);
        if (!response.ok) {
          Alert.alert('Error: ', response.status.toString());
          throw Error('Error' + response.status);
        }
        return response.json();
      })
      .then(orderId => {
        this.setState({orderId: orderId});
        console.log(orderId);
      })
      .catch(error => {
        console.log(error);
      });
  }

  _savePaymentRecord() {
    let url = config.settings.serverPath + '/api/payment';

    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order_id: this.state.orderId.id,
        amount:
          Math.ceil(this.state.totalWeight.total) * 5 + this.state.total.total,
        provider: 'VISA',
        status: 'ACCEPTED',
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
        } else {
          Alert.alert('Error in SAVING');
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  _updateStock(product_id, quantity) {
    let url = config.settings.serverPath + '/api/product/' + product_id;

    fetch(url, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quantity: quantity,
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
        } else {
          Alert.alert('Error in UPDATING');
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  _removeCartItem(product_id) {
    let url =
      config.settings.serverPath +
      '/api/cart-item/' +
      this.state.cart_id +
      '/' +
      product_id;
    console.log(url);
    fetch(url, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
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
  }

  placeOrder() {
    if (!this.state.shippingAddress.trim()) {
      alert('Please Enter Shipping Address!');
      return;
    }

    this._saveOrderRecord();
    this._getOrderId();

    this.state.cartItem.map(item => {
      this._updateStock(item.id, item.quantity);
    });
    this.state.cartItem.map(item => {
      this._removeCartItem(item.id);
    });
  }

  componentDidMount() {
    this._loadMemberDetails();
    this._loadOrderDetails();
    this._loadSubtotal();
    this._loadTotalWeight();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.orderId !== this.state.orderId) {
      this.state.cartItem.map(item => {
        this._saveOrderItemRecord(item.id, item.quantity);
      });
      this._savePaymentRecord();
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.infoContainer}>
          <Text style={styles.title}>Delivery Details</Text>
          <Text style={styles.field}>Name: {this.state.member.fname}</Text>
          <Text style={styles.field}>Contact: {this.state.member.phone}</Text>
          <Text style={styles.field}>Shipping address: </Text>
          <TextInput
            name="shipping"
            style={styles.input}
            onChangeText={shippingAddress => {
              this.setState({shippingAddress: shippingAddress});
            }}
            placeholder={this.state.member.address}
            underlineColorAndroid="#f000"
          />

          <Text style={styles.title}>Order Details</Text>

          {/* display order details */}
          <FlatList
            refreshing={this.state.isFetching}
            onRefresh={this._load}
            data={this.state.cartItem}
            renderItem={({item}) => {
              return (
                <View style={{flexDirection: 'row', height: 150}}>
                  <View style={{flex: 1}}>
                    <Image
                      source={{uri: item.photo}}
                      style={styles.image}></Image>
                  </View>

                  <View style={{flex: 2}}>
                    <Text style={styles.name}> {item.name}</Text>
                    <Text style={styles.details}>
                      Quantity: {item.quantity}
                    </Text>
                    <Text style={styles.details}>
                      Weight: {item.weight}kg /pcs
                    </Text>
                    <Text style={styles.price}>RM {item.price}</Text>
                  </View>
                </View>
              );
            }}></FlatList>
          <Text style={styles.title}>Payment Details</Text>

          <Text style={styles.price}>
            Subtotal: RM {this.state.total.total}
          </Text>
          <Text style={styles.price}>
            Shipping Fee: RM{' '}
            {(Math.ceil(this.state.totalWeight.total) * 5).toFixed(2)}
          </Text>
          <Text style={styles.price}>
            Total Payment: RM{' '}
            {Math.ceil(this.state.totalWeight.total) * 5 +
              this.state.total.total}
          </Text>

          <AppButton title="Place Order" onPress={this.placeOrder} />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'lightpink',
    paddingBottom: '5%',
  },
  image: {
    height: 90,
    width: 90,
  },
  infoContainer: {
    paddingHorizontal: '8%',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  title: {
    width: '100%',
    marginTop: 20,
    marginBottom: 10,
    fontSize: 25,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'right',
  },
  field: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  details: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: 'black',
    borderWidth: 1,
    borderRadius: 5,
  },
});
