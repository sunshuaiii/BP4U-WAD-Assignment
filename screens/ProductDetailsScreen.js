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

let config = require('../Config');

// creating the product detials screen

export default class ProductDetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productId: this.props.route.params.productId,
      product: [],
    };
    this._loadByID = this._loadByID.bind(this);
    this._addToCart = this._addToCart.bind(this);
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

  _addToCart() {
    Alert.alert('Hi adding to cart ya');
  }

  componentDidMount() {
    this._loadByID();
  }

  render() {
    if(this.state.product.discount == 0){
      return (
      <View style={styles.container}>
        <ScrollView>
          {/* <Button onPress={() => this.props.navigation.goBack()}/> */}
          <Image style={styles.image} source={{uri: this.state.product.photo}} />
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
            <AppButton
              onPress={() => {
                this._addToCart;
              }}
              title="Add to cart"
            />
            
          </View>
        </ScrollView>
      </View>
    );
  } else{
    return (
      <View style={styles.container}>
        <ScrollView>
          {/* <Button onPress={() => this.props.navigation.goBack()}/> */}
          <Image style={styles.image} source={{uri: this.state.product.photo}} />
          <View style={styles.infoContainer}>
            <Text style={styles.name}>{this.state.product.name}</Text>
            <Text style={styles.description}>{this.state.product.desc}</Text>
            <Text style={styles.discountedPrice}>RM {this.state.product.price}</Text>
            <Text style={styles.price}>RM {(Number(this.state.product.price) * (1-Number(this.state.product.discount))).toFixed(2)}</Text>
            <Text style={styles.attribute}>
              Weight: {this.state.product.weight} kg
            </Text>
            <Text style={styles.attribute}>
              Stock: {this.state.product.stock}
            </Text>
            <Text style={styles.attribute}>
              Category: {this.state.product.category}
            </Text>
            <Text style={styles.attribute}>Discount: {Number(this.state.product.discount)*100}%</Text>
            <AppButton
              onPress={() => {
                this._addToCart;
              }}
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
    backgroundColor: "lightpink",
    paddingBottom: "5%",
  },
  image: {
    height: 360,
    borderRadius: 16,
    width: '100%',
  },
  infoContainer: {
    padding: 16,
  },
  name: {
    fontSize: 22,
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