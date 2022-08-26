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
      // cartId: this.props.route.params.cartId,
      cart_id: '60001',
      memberid: '10001',
      member: [],
      cartItem: [],
      shippingAddress: '',
      shippingFee: '',
      total: '',
      name: '',
      contact: '',
      totalPayment: '',
      isFetching: false,
      radioButtonsData: [
        {
          id: '1',
          label: 'Touch N Go',
          value: 'TNG',
        },
        {
          id: '2',
          label: 'Visa Card',
          value: 'VISA',
        },
      ],
    };
    this._loadMemberDetails = this._loadMemberDetails.bind(this);
    this._loadOrderDetails = this._loadOrderDetails.bind(this);
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
      '/api/cart-item/incart/' +
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

  // handleOnChangeText = text => {
  //   this.setState({
  //     shippingAddress: text,
  //   });
  // };

  // onPressRadioButton(radioButtonsArray) {
  //   setRadioButtons(radioButtonsArray);
  // }

  placeOrder() {}

  componentDidMount() {
    this._loadMemberDetails();
    this._loadOrderDetails();
  }

  render() {
    // const [radioButtons, setRadioButtons] = useState(
    //   this.state.radioButtonsData,
    // );
    console.log(this.state.member);
    return (
      <View style={styles.container}>
        <FlatList
          refreshing={this.state.isFetching}
          onRefresh={this._loadMemberDetails}
          data={this.state.member}
          renderItem={({item}) => {
            return (
              <View>
                <Text style={styles.title}>Delivery Details</Text>
                <Text style={styles.field}>Name: {item.fname}</Text>
                <Text style={styles.field}>Contact: {item.phone}</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={shippingAddress => {
                    this.setState({shippingAddress});
                  }}
                  placeholder={this.state.shippingAddress}
                  placeholderTextColor="#fffafa"
                  underlineColorAndroid="#f000"
                />
              </View>
            );
          }}></FlatList>
        <Text style={styles.field}>Courier: </Text>

        <Text style={styles.title}>Order Details</Text>

        {/* display order details */}
        <View style={styles.txt}></View>

        <Text style={styles.title}>Payment Details</Text>

        {/* display payment details */}
        {/* <RadioGroup
            radioButtons={radioButtons}
            onPress={onPressRadioButton}
          /> */}

        <Text style={styles.price}>Subtotal: RM {/*total*/}</Text>
        <Text style={styles.price}>Shipping Fee: RM {/*shippingFee*/}</Text>
        <Text style={styles.price}>Total Payment: RM {/*totalPayment*/}</Text>

        <AppButton title="Place Order" />
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
    marginTop: 15,
    height: 360,
    borderRadius: 16,
    width: '100%',
  },
  infoContainer: {
    padding: 16,
  },
  name: {
    marginTop: 10,
    fontSize: 25,
    fontWeight: 'bold',
  },
  title: {
    width: '100%',
    marginTop: 20,
    fontSize: 25,
    fontWeight: 'bold',
    marginLeft: '10%',
  },
  price: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'right',
  },
  field: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 25,
  },
});
