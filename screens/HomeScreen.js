import React, { Component } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  FlatList,
  View,
  Switch,
  Button,
  TouchableNativeFeedback,
  Alert,
} from "react-native";
import { InputWithLabel, PickerWithLabel, AppButton } from "../UI";

let config = require("../Config");

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      members: [],
      isFetching: false,
    };
    this._load = this._load.bind(this);
  }

  _load() {
    let url = config.settings.serverPath + "/api/member";
    this.setState({ isFetching: true });
    fetch(url)
      .then((response) => {
        console.log(response);
        if (!response.ok) {
          Alert.alert("Error:", response.status.toString());
          throw Error("Error " + response.status);
        }
        this.setState({ isFetching: false });
        return response.json();
      })
      .then((members) => {
        console.log(members);
        this.setState({ members: members });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  componentDidMount() {
    this._load();
  }

  render() {
    return (
      <View style={{flex: 1, margin: 5}}>
        <FlatList
          refreshing={this.state.isFetching}
          onRefresh={this._load}
          data={this.state.member}
          renderItem={({data}) => {
            return (
                <View style={{borderBottomWidth: 1, borderBottomColor: 'grey'}}>
                  <Text style={{fontSize: 20, fontWeight: 'bold'}}>HI</Text>
                  <Text style={{fontSize: 20, fontWeight: 'bold'}}>{item.lname}</Text>
                  <Text style={{fontSize: 15}}>{item.email}</Text>
                  <Text style={{fontSize: 15}}>{item.phone}</Text>
                </View>
            );
          }}></FlatList>
      </View>
    );
  }
}
