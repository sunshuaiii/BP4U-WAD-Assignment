import React, {Component, useEffect, useState, useContext} from 'react';
import {
  Text,
  Image,
  View,
  ScrollView,
  Button,
  Alert,
  StyleSheet,
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
      cartId: '60001',
      shippingAddress: '',
      shippingFee: '',
      total: '',
      name: '',
      contact: '',
      totalPayment: '',
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

    this.db = SQLite.openDatabase(
      {name: 'bp4udb', createFromLocation: '~bp4u.sqlite'},
      this.openCallback,
      this.errorCallback,
    );
  }

  openCallback() {
    console.log('Database open successfully.');
  }

  errorCallback(err) {
    console.log('Error in opening the database: ' + err);
  }

  handleOnChangeText = text => {
    this.setState({
      shippingAddress: text,
    });
  };

  onPressRadioButton(radioButtonsArray) {
    setRadioButtons(radioButtonsArray);
  }

  placeOrder() {}

  componentDidMount() {}

  render() {
    const [radioButtons, setRadioButtons] = useState(
      this.state.radioButtonsData,
    );

    return (
      <View style={styles.container}>
        <ScrollView>
          <Text style={styles.title}>Delivery Details</Text>
          <Text style={styles.field}>Name: </Text>
          <Text style={styles.field}>Contact: </Text>
          <TextInput
            style={styles.input}
            onChangeText={handleOnChangeText}
            placeholder={this.state.shippingAddress}
            placeholderTextColor="#fffafa"
            underlineColorAndroid="#f000"
          />
          <Text style={styles.field}>Courier: </Text>

          <Text style={styles.title}>Order Details</Text>

          {/* display order details */}
          <View style={styles.txt}></View>

          <Text style={styles.title}>Payment Details</Text>

          {/* display payment details */}
          <RadioGroup
            radioButtons={radioButtons}
            onPress={onPressRadioButton}
          />

          <Text style={styles.price}>Subtotal: RM {total}</Text>
          <Text style={styles.price}>Shipping Fee: RM {shippingFee}</Text>
          <Text style={styles.price}>Total Payment: RM {totalPayment}</Text>

          <AppButton title="Place Order" onPress={placeOrder} />
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
  },
});
