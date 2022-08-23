import React, {Component} from 'react';
import { View, Text, Image, StyleSheet, Button, TouchableOpacity, FlatList ,Alert} from "react-native";
import { TouchableHighlight,ScrollView } from "react-native-gesture-handler";
import { color } from "react-native-reanimated";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import SQLite from "react-native-sqlite-storage";

let config = require('../Config');

export default class EditCartScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            cartItem:[],
            id: this.props.route.params.id,
            quantity: 0,
            isFetching: false,
        };

    this._loadbyId = this._loadbyId.bind(this);    
    this._update = this._update.bind(this);
    }

_loadbyId(){
    let url = config.settings.severPath + '/api/cart-item/' + this.state.id;
    this.setState({isFetching: true});
    fetch(url)
        .then(response =>{
        console.log(response);
        if(!response.ok){
            Alert.alert('Error: ', response.status.toString());
            throw Error('Error'+ response.status);
        }
        this.setState({isFetching:false});
        return response.json();
        })
        .then(cartItem =>{
            console.log(cartItem);
            this.setState({
            cartItem: cartItem,
            quantity: cartItem.quantity,
            })
        })
    .catch(error =>{
        console.log(error);
    })
}

_update(){
    let url = config.settings.serverPath + '/api/cart-item/' + this.state.id;
    this.setState({isFetching: true});
    fetch(url,{
        method:'PUT',
        headers:{
            Accept: 'application/json',
            'Content-Type':'application/json',
        },
        body: JSON.stringify({
            id: this.state.id,
            cart_id: this.state.cart_id,
            product_id: this.state.product_id,
            quantity: this.state.quantity,
        }),
    })
    .then(response => {
        if(!response.ok){
            lert.alert('Error: ', response.status.toString());
            throw Error('Error'+ response.status);
        }
        this.setState({isFetching:false});
        return response.json();
    })
     .then(respondJson =>{
        if(respondJson.affected > 0){
            Alert.alert ('Record UPDATED for',this.state.quantity);
        }
        else{
            Alert.alert ('Error in UPDATING');
        }
    })
    .catch(error =>{
        console.log(error);
    })
}
      
componentDidMount(){
    this._loadbyId();
}
    
  render() {
    let cartItem = this.state.cartItem
    return (
        <ScrollView style = {{flex: 1, margin: 5}}>
            <View style = {{flexDirection: 'row', height: 150}}>
              <View style = {{flex: 1}}>
                <Image source = {require('../productimg/bpshirt.jpg')}
                style = {styles.image}
                ></Image>
              </View>

              <View style= {{flex: 2}}>
                <Text style = {styles.itemName}>{this.state.id}</Text>
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
                  <TouchableOpacity style = {styles.quantityButton} onPress = {() =>{this.setState({id: item.id}); this.addQuantity(quantity)}}>
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
  }
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
  
    itemQuantity:{
      marginTop: -5,
      margin: 15,
      color: 'black',
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
      width: 65,
      height: 30,
      backgroundColor: '#FF9F00',
      borderWidth: 1,
      borderRadius: 5,
      borderColor: 'black',
      padding: 3,
      marginTop: -10,
      marginLeft: 40,
    },
  });