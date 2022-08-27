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
      order_id: this.props.route.params.orderID,
      member_id: '10001',
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
        'SELECT order_details.order_id, order_details.order_member_id,order_item.oi_product_id, order_item.oi_quantity, product.product_name, product.product_price, product.product_photo, product.product_discount_percent FROM order_details JOIN order_item ON order_details.order_id=order_item.oi_order_id JOIN product ON order_item.oi_product_id=product.product_id JOIN member ON order_details.order_member_id=member.member_id WHERE order_details.order_id=? AND member.member_id=?',
        [this.state.order_id, this.state.member_id],
        (tx, results) => this.setState({order_details: results.rows.raw()}),
        console.log(this.state.order_details),
      ),
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.order_id !== this.state.order_id) {
      this.state._queryByID();
    }
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
      <View style={{backgroundColor: 'pink'}}>
        <View style={styles.icon_inline}>
          <Ionicons name="album" size={28} color={'black'} />
          <Text style={{color: 'black', fontSize: 20}}> Order Item</Text>
        </View>
        <ScrollView>
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
                        productId: item.oi_product_id,
                      });
                    }}>
                    <Text style={styles.productDescription}>
                      {item.product_name}
                      {'\n'}
                    </Text>
                  </TouchableHighlight>
                  <Text style={styles.price}>
                    RM{' '}
                    {(
                      item.product_price *
                      (1 - item.product_discount_percent)
                    ).toFixed(2)}{' '}
                    X {item.oi_quantity}
                  </Text>
                </View>
              </View>
            )}></FlatList>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  orderContainer: {
    padding: 15,
    backgroundColor: 'pink',
    marginBottom: 60,
  },
  orderInformation: {
    padding: 15,
    backgroundColor: 'mistyrose',
    borderColor: 'pink',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
  },
  icon_inline: {
    flexDirection: 'row',
    size: 19,
    backgroundColor: 'pink',
    padding: 10,
  },
  productDescription: {
    color: 'black',
    fontSize: 15,
    fontStyle: 'bold',
    backgroundColor: 'pink',
    borderRadius: 10,
    letterSpacing: 2,
    textAlign: 'center',
    paddingTop: 10,
  },
  price: {
    marginVertical: 10,
    textAlign: 'right',
    color: 'black',
    fontSize: 15,
    fontStyle: 'bold',
    letterSpacing: 2,
  },
  image: {
    marginHorizontal: 90,
    height: 170,
    width: 170,
    margin: 5,
  },
  orderAmount: {
    color: 'black',
    fontSize: 15,
    marginTop: 30,
  },
});
