import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity, Button } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/MaterialIcons'
import { NavigationContainer } from '@react-navigation/native';

let SQLite = require('react-native-sqlite-storage');

export default class HistoryScreen extends Component<Props> {
  static navigationOptions = {
    title: 'Order Items',
  };

  constructor(props) {
    super(props);
    this.state = {
      order_details: [],
    };
    this.db = SQLite.openDatabase(
      {
        name: 'order_details',
        createFromLocation: '~bp4u.sqlite'
      },
      this.openCallback,
      this.errorCallback,
    );
    this._query = this._query.bind(this);
  }
  componentDidMount() {
    this._query();
  }

  _query() {
    this.db.transaction(tx =>
      tx.executeSql("SELECT order_details.order_id, order_details.order_member_id, order_details.order_shipping_address, order_details.order_courier, order_details.order_shipping_fee, order_details.order_total, order_details.order_status, order_details.order_creation_date, order_item.oi_product_id, order_item.oi_quantity, product.product_name, product.product_price, product.product_photo, member.member_username, member.member_phone FROM order_details JOIN order_item ON order_details.order_id=order_item.oi_order_id JOIN product ON order_item.oi_product_id=product.product_id JOIN member ON order_details.order_member_id=member.member_id WHERE member.member_id='10001' ORDER BY order_details.order_id", [], (tx, results) =>
        this.setState({ order_details: results.rows.raw() }),
        console.log(this.state.order_details)
      ),
    );
  }

  openCallback() {
    console.log('database open successfully');
  }
  errorCallback(err) {
    console.log('Error in opening the database: ' + err);
  }
  render() {
    return (
      <FlatList style={styles.orderContainer}
        data={this.state.order_details}
        extraData={this.state}
        showsVerticalScrollIndicator={true}
        renderItem={({ item }) => (
          <View style={styles.orderInformation}>
            <Text style={{ color: 'black', fontSize: 18, fontWeight: 'bold' }}>Order ID: {item.order_id}</Text>
            <Text style={styles.rightSide}>{item.order_status}</Text>
            <View style={styles.icon_inline}><Ionicons name="local-shipping" size={22} color={'green'} /><Text style={{ color: 'black', fontSize: 17 }}>  Shipping Information</Text></View>
            <Text style={{ color: 'black' }}>
              Courier: {item.order_courier}{"\n"}
              Name: {item.member_username}{"\n"}
              Phone Number: {item.member_phone}{"\n"}
              Address: {item.order_shipping_address}{"\n"}
            </Text>
            <View>
              <Text style={styles.orderAmount}>
                <Text style={{ fontSize: 20, textDecorationLine: 'underline', fontWeight: 'bold' }}>Order Summary{"\n"}</Text>
                Order Total:     RM{item.order_total}{"\n"}
                Shipping Fee:  RM{item.order_shipping_fee}{"\n"}
                Total Amount: RM{item.order_shipping_fee + item.order_total}
              </Text>
            </View>
            <Button
              title='View Order Items'
              onPress={() => {
                this.props.navigation.navigate('OrderItem', {
                  order_id: item.order_id,
                  refresh: this._query,
                });
              }} />
          </View>

        )}
      ></FlatList>
    )
  }
}


const styles = StyleSheet.create({
  orderContainer: {
    padding: 5,
    backgroundColor: 'pink',
  },
  orderInformation: {
    padding: 15,
    backgroundColor: '#ffff',
    borderColor: 'black',
    borderWidth: 1,
  },
  rightSide: {
    position: 'absolute',
    right: 15,
    top: 15,
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold'
  },
  icon_inline: {
    flexDirection: 'row',
    size: 19,
    color: 'green',
  },
  orderAmount: {
    color: 'black',
    fontSize: 15,
    marginTop: 10,
    marginBottom: 20
  },
});