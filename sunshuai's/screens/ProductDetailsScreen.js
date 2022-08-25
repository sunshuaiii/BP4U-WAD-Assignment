import React, {Component} from 'react';
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
      total: 0,
      quantityInCart: 0,
      initialQuantity: '1',
    };
    this._loadByID = this._loadByID.bind(this);
    this._addToCart = this._addToCart.bind(this);
    this._insertCartItem = this._insertCartItem.bind(this);
    this._queryCartTotal = this._queryCartTotal.bind(this);
    this._updateCartTotal = this._updateCartTotal.bind(this);
    this._updateCartItemQuantity = this._updateCartItemQuantity.bind(this);
    this._checkProductInCart = this._checkProductInCart.bind(this);
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
    let url = config.settings.serverPath + '/api/cart-item';

    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cart_id: this.state.cartId,
        product_id: this.state.productId,
        quantity: this.state.initialQuantity,
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
          Alert.alert('Record SAVED for', this.state.productId.toString());
        } else {
          Alert.alert('Error in SAVING');
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  _queryCartTotal() {
    let url =
      config.settings.serverPath + '/api/cart/cart-total/' + this.state.cartId;
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

  _updateCartTotal() {
    let url = config.settings.serverPath + '/api/cart/' + this.state.cartId;

    fetch(url, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: this.state.cartId,
        total: this.state.total.total,
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
          Alert.alert('Record UPDATED for', this.state.name);
        } else {
          Alert.alert('Error in UPDATING');
        }
        this.props.route.params._refresh();
        this.props.navigation.goBack();
      })
      .catch(error => {
        console.log(error);
      });
  }

  _updateCartItemQuantity() {
    let url =
      config.settings.serverPath +
      '/api/cart-item/update-quantity/' +
      this.state.cartId +
      '/' +
      this.state.productId;

    fetch(url, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
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
          Alert.alert('Record UPDATED');
        } else {
          Alert.alert('Error in UPDATING');
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  _checkProductInCart() {
    let url =
      config.settings.serverPath +
      '/api/product/quantity-in-cart/' +
      this.state.cartId +
      '/' +
      this.state.productId;
    console.log(url);

    fetch(url)
      .then(response => {
        if (!response.ok) {
          Alert.alert('Error:', response.status.toString());
          throw Error('Error ' + response.status);
        }
        return response.json();
      })
      .then(quantityInCart => {
        this.setState({quantityInCart: quantityInCart});
      })
      .catch(error => {
        console.error(error);
      });
  }

  _addToCart() {
    // check if the product is in the cart
    this._checkProductInCart();
    console.log(this.state.quantityInCart.quantity);

    // if the product is not in the cart, put the product to the cart
    if (this.state.quantityInCart.quantity == 0) {
      this._insertCartItem();
      Alert.alert('Item successfully added to your cart!');
    }
    // product in the cart, quantity +1
    else {
      this._updateCartItemQuantity();
      Alert.alert('Item already added to your cart!');
    }
    // update cart total
    this._queryCartTotal();
    console.log(this.state.total.total);
    this._updateCartTotal();
  }

  componentDidMount() {
    this._loadByID();

    // check if the product is in the cart
    this._checkProductInCart();
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
