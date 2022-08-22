import React, {Component} from 'react';
import { View, Text, Image, StyleSheet, Button, TouchableOpacity } from "react-native";
import { TouchableHighlight,ScrollView } from "react-native-gesture-handler";
import { color } from "react-native-reanimated";
import Icon from 'react-native-ionicons';
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import SQLite from "react-native-sqlite-storage";

let config = require('../Config');

export default class CartScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      cartItem:[],
      quantity: 1,
      isFetching: false,
    };
    this._load = this._load.bind(this);
  }
  
  _load(){
    let url = config.settings.serverPath + '/api/cart-item';
    this.setState({isFetching: true});
    fetch(url)
      .then(response =>{
        console.log(response);
        if(!response.ok){
          Alert.alert('Error: ', repsonse.status.toString());
          throw Error('Error'+ response.status);
        }
        this.setState({isFetching:false});
        return response.json();
      })
      .then(cartItem =>{
        console.log(cartItem);
        this.setState({cartItem: cartItem});
      })
      .catch(error =>{
        console.log(error);
      });
  }

  componentDidMount(){
    this._load();
  }

  addQuantity = () => {
    this.setState({
      quantity: this.state.quantity +1
    })
    console.log('pressed');
  }

  removeQuantity = () => {
    if (this.state.quantity === 1){
      return;
    }
    this.setState({
      quantity: this.state.quantity -1
    })
  }

  removeItem = () =>{
    console.log('pressed');
  }
<FlatList
  refeshing = {this.state.isFetching}
  onPress = {this.load}
  data = {this.state.cartItem}
  renderItem={({item}) => {
    return (
      <ScrollView style = {{marginbottom: 80}}>
        <View style = {{flexDirection: 'row', height: 150}}>
          <View style = {{flex: 1}}>
            <Image source = {require('../productimg/bpshirt.jpg')}
            style = {styles.image}
            ></Image>
          </View>

          <View style= {{flex: 2}}>
            <Text style = {styles.itemName}>Item Name</Text>
            <Text style = {styles.itemPrice}>Price: RM 149.99</Text>

            <View style = {{flexDirection: 'row'}}>
              <TouchableOpacity style = {styles.quantityButton} onPress = {this.removeQuantity}>
                <SimpleLineIcons
                  name = "minus"
                  style = {styles.minusIcon}
                  color={"black"}
                  size = {20}></SimpleLineIcons>
              </TouchableOpacity>
              <Text style ={{fontSize: 15, color: 'black'}}>{this.state.quantity}</Text>
              <TouchableOpacity style = {styles.quantityButton} onPress = {this.addQuantity}>
                <SimpleLineIcons
                  name = "plus"
                  style = {styles.plusIcon}
                  color={"black"}
                  size = {20}></SimpleLineIcons>
              </TouchableOpacity>
              <TouchableOpacity style = {styles.removeButton} onPress = {this.removeItem}>
                <Text color = 'black'>REMOVE</Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </ScrollView>
    );
  }}></FlatList>
}

const styles = StyleSheet.create({
  image: {
    height: 100,
    width: 100,
    margin: 15,
  },

  itemName:{
    margin: 15,
    fontSize: 20,
    color: 'black',
  },

  itemPrice:{
    marginTop: -5,
    margin: 15,
    color: '#FF4023',
    fontSize: 13.5,
  },

  quantityButton:{
    width: 40,
    height: 40,
  },

  minusIcon:{
    marginLeft: 15,
  },

  plusIcon:{
    marginLeft: 5,
  },

  removeButton:{
    backgroundColor: '#FF9F00',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'black',
    padding: 3,
    marginTop: -3,
  },
});