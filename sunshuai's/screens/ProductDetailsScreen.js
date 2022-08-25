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

let config = require('../Config');

// creating the product detials screen

export default class ProductDetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productId: this.props.route.params.productId,
      product: [],
      memberId: '10005',
      cartId: '60005',
      total: '',
      quantity: '',
      count: [],
      initialQuantity: '1',
    };
    this._loadByID = this._loadByID.bind(this);
    this._addToCart = this._addToCart.bind(this);
    this._insertCartItem = this._insertCartItem.bind(this);
    this._queryCartTotal = this._queryCartTotal.bind(this);
    this._updateCartTotal = this._updateCartTotal.bind(this);
    this._updateCartItemQuantity = this._updateCartItemQuantity.bind(this);

    this.db = SQLite.openDatabase(
      {name: 'bp4udb', createFromLocation: '~bp4u.sqlite'},
      this.openCallback,
      this.errorCallback,
    );
  }

  _loadByID() {
    console.log(this.state.productId);
    let url =
      config.settings.serverPath + '/api/product/' + this.state.productId;
    console.log(url);
    fetch(url)
      .then(response => {
        if (!response.ok) {
          Alert.alert('Error:', response.status.toString());
          throw Error('Error ' + response.status);
        }
        return response.json();
      })
      .then(product => {
        this.setState({product: product});
      })
      .catch(error => {
        console.error(error);
      });
  }

  _insertCartItem() {
    this.db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO cart_item(ci_cart_id, ci_product_id, ci_quantity) VALUES (?,?,?)',
        [this.state.cartId, this.state.productId, this.state.initialQuantity],
      );
    });
    console.log('_insertCartItem');
  }

  _queryCartTotal() {
    this.db.transaction(tx => {
      tx.executeSql(
        'SELECT round(SUM(product.product_price*(1-product.product_discount_percent) * cart_item.ci_quantity),2) FROM product INNER JOIN cart_item ON product.product_id = cart_item.ci_product_id WHERE cart_item.ci_cart_id=?',
        [this.state.cartId],
        (tx, results) => {
          if (results.rows.length) {
            this.setState({
              total: results.rows.item(0).total,
            });
          }
        },
      );
    });
    console.log('_queryCartTotal');
  }

  _updateCartTotal() {
    this.db.transaction(tx => {
      tx.executeSql('UPDATE cart SET cart_total=? WHERE cart_id=?', [
        this.state.total,
        this.state.cartId,
      ]);
    });
    console.log('_updateCartTotal');
  }

  _updateCartItemQuantity() {
    this.db.transaction(tx => {
      tx.executeSql(
        'UPDATE cart_item SET ci_quantity=? WHERE ci_cart_id=? AND ci_product_id=?',
        [
          (Number(this.state.quantity) + 1).toString(),
          this.state.cart_Id,
          this.state.productId,
        ],
      );
    });
    console.log('_updateCartItemQuantity');
  }

  _addToCart() {
    // check if the product is in the cart
    this.db.transaction(tx =>
      tx.executeSql(
        'SELECT COUNT(*) as count FROM cart_item WHERE ci_cart_id=? AND ci_product_id=?',
        [this.state.cartId, this.state.productId],
        (tx, results) => this.setState({count: results.rows.raw()}),
      ),
    );
    console.log(this.state.count);
    // if the product is not in the cart, put the product to the cart
    if (this.state.count === 0) {
      this._insertCartItem();
    }
    // product in the cart, quantity +1
    else {
      this._updateCartItemQuantity();
    }
    // update cart total
    this._queryCartTotal();
    this._updateCartTotal();
    Alert.alert('Item successfully added to your cart!');
  }

  openCallback() {
    console.log('Database open successfully.');
  }

  errorCallback(err) {
    console.log('Error in opening the database: ' + err);
  }

  componentDidMount() {
    this._loadByID();
  }

  render() {
    if (this.state.product.discount == 0) {
      return (
        <View style={styles.container}>
          <ScrollView>
            {/* <Button onPress={() => this.props.navigation.goBack()}/> */}
            <Image
              style={styles.image}
              source={{uri: this.state.product.photo}}
            />
            <View style={styles.infoContainer}>
              <Text style={styles.name}>{this.state.product.name}</Text>
              <Text style={styles.description}>{this.state.product.desc}</Text>
              <Text style={styles.price}>RM {this.state.product.price}</Text>
              <Text style={styles.attribute}>
                Weight: {this.state.product.weight} kg
              </Text>
              <Text style={styles.attribute}>
                Stock: {this.state.product.stock}
              </Text>
              <Text style={styles.attribute}>
                Category: {this.state.product.category}
              </Text>
              <AppButton onPress={this._addToCart} title="Add to cart" />
            </View>
          </ScrollView>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <ScrollView>
            {/* <Button onPress={() => this.props.navigation.goBack()}/> */}
            <Image
              style={styles.image}
              source={{uri: this.state.product.photo}}
            />
            <View style={styles.infoContainer}>
              <Text style={styles.name}>{this.state.product.name}</Text>
              <Text style={styles.description}>{this.state.product.desc}</Text>
              <Text style={styles.discountedPrice}>
                RM {this.state.product.price}
              </Text>
              <Text style={styles.price}>
                RM{' '}
                {(
                  Number(this.state.product.price) *
                  (1 - Number(this.state.product.discount))
                ).toFixed(2)}
              </Text>
              <Text style={styles.attribute}>
                Weight: {this.state.product.weight} kg
              </Text>
              <Text style={styles.attribute}>
                Stock: {this.state.product.stock}
              </Text>
              <Text style={styles.attribute}>
                Category: {this.state.product.category}
              </Text>
              <Text style={styles.attribute}>
                Discount: {Number(this.state.product.discount) * 100}%
              </Text>
              <AppButton
                onPress={this._addToCart}
                title="Add to cart"
                style={styles.button}
              />
            </View>
          </ScrollView>
        </View>
      );
    }
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
  price: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'right',
  },
  discountedPrice: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'right',
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  attribute: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 20,
    fontWeight: '400',
    color: '#787878',
    marginTop: 10,
    marginBottom: 16,
  },
});
