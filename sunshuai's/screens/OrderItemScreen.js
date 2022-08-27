import React, {Component} from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableHighlight,
  Button,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/MaterialIcons';

let SQLite = require('react-native-sqlite-storage');

export default class OrderItemScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order_details: [],
    };
    this.db = SQLite.openDatabase(
      {
        name: 'order_details2',
        createFromLocation: '~bp4u.sqlite',
      },
      this.openCallback,
      this.errorCallback,
    );
    this._queryByID = this._queryByID.bind(this);
  }
  componentDidMount() {
    this._queryByID();
  }

  _queryByID() {
    this.db.transaction(tx =>
      tx.executeSql(
        "SELECT order_details.order_id, order_details.order_member_id,order_item.oi_product_id, order_item.oi_quantity, product.product_name, product.product_price, product.product_photo FROM order_details JOIN order_item ON order_details.order_id=order_item.oi_order_id JOIN product ON order_item.oi_product_id=product.product_id JOIN member ON order_details.order_member_id=member.member_id WHERE order_details.order_id='30001' AND member.member_id='10001'",
        [],
        (tx, results) => this.setState({order_details: results.rows.raw()}),
        console.log(this.state.order_details),
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
    console.log(this.state.order_details);
    return (
      <View>
        <View style={styles.icon_inline}>
          <Ionicons name="album" size={28} color={'black'} />
          <Text style={{color: 'black', fontSize: 20}}> Order Item</Text>
        </View>
        <FlatList
          style={styles.orderContainer}
          data={this.state.order_details}
          extraData={this.state}
          showsVerticalScrollIndicator={true}
          renderItem={({item}) => (
            <View style={styles.orderInformation}>
              <View style={styles.orderItem}>
                <Image
                  source={{uri: item.product_photo}}
                  style={styles.image}></Image>

                <TouchableHighlight
                  underlayColor="pink"
                  onPress={() => {
                    this.props.navigation.navigate('ProductDetails', {
                      product_id: item.product_id,
                      refresh: this._query,
                    });
                  }}>
                  <Text style={styles.productDescription}>
                    {item.product_name}
                    {'\n'}
                    RM {item.product_price} X {item.oi_quantity}
                  </Text>
                </TouchableHighlight>
              </View>
            </View>
          )}></FlatList>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  orderContainer: {
    padding: 5,
    backgroundColor: 'pink',
    marginBottom: 30,
  },
  orderInformation: {
    padding: 15,
    backgroundColor: '#fff',
    borderColor: 'black',
    borderWidth: 1,
  },
  icon_inline: {
    flexDirection: 'row',
    size: 19,
    backgroundColor: 'pink',
  },
  productDescription: {
    marginTop: 20,
    color: 'black',
    fontSize: 15,
    fontStyle: 'bold',
  },
  image: {
    height: 100,
    width: 100,
    margin: 15,
  },
  orderAmount: {
    color: 'black',
    fontSize: 15,
    marginTop: 30,
  },
});
