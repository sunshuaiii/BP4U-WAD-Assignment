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
    this._saveOrderRecord = this._saveOrderRecord.bind(this);
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
  
  _saveOrderRecord(){
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
        courier: this.state.courier,
        ship_fee: this.state.shippingFee,
        total: this.state.totalPayment,
        status: this.state.status,
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
          Alert.alert('Record SAVED for', this.state.id);
        } else {
          Alert.alert('Error in SAVING');
        }
      })
      .catch(error => {
        console.log(error);
      });
      this.props.route.params._refresh();
      this.props.navigation.goBack();
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
    console.log(this.state.cartItem);
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Delivery Details</Text>
        <Text style={styles.field}>Name: {this.state.member.fname }</Text>
        <Text style={styles.field}>Contact: {this.state.member.phone}</Text>
        <TextInput
          style={styles.input}
          onChangeText={shippingAddress => {
            this.setState({shippingAddress});
          }}
          placeholder={this.state.member.address}
          placeholderTextColor="#fffafa"
          underlineColorAndroid="#f000"
        />
        <Text style={styles.field}>Courier: </Text>

        <Text style={styles.title}>Order Details</Text>

        {/* display order details */}
        <FlatList
          refreshing={this.state.isFetching}
          onRefresh={this._load}
          data={this.state.cartItem}
          renderItem = {({item}) =>{
            return(
            <View style={styles.txt}>
              <Text style={styles.field}>Product Name: {item.name }</Text>
              <Text style={styles.field}>Quantity: {item.quantity}</Text>
              <Text style ={styles.field}>Price: {item.price}</Text>
            </View>
            );
          }}
        ></FlatList>
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
