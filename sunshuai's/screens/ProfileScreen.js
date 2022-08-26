import React, { Component, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Button,
  Alert,
  ScrollView,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import { FlatList, TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SQLite from 'react-native-sqlite-storage';

let config = require('../Config');

export default class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      memberid: '10001',
      member: [],
      isFetching: false,
    };
    this._loadMemberDetails = this._loadMemberDetails.bind(this);
  }

  componentDidMount() {
    this._loadMemberDetails();
  }

  _loadMemberDetails() {
    let url = config.settings.serverPath + '/api/member/' + this.state.memberid;
    console.log(url);
    this.setState({ isFetching: true });
    fetch(url)
      .then(response => {
        console.log(response);
        if (!response.ok) {
          Alert.alert('Error: ', response.status.toString());
          throw Error('Error' + response.status);
        }
        this.setState({ isFetching: false });
        return response.json();
      })
      .then(member => {
        this.setState({ member: member });
        console.log(member);
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    let username = new String(this.state.member.username);
    return (
      <View style={styles.body}>
        <View style={styles.profileHeader}>
          <View style={styles.profileHeaderPicCircle}>
            <Text style={{ fontSize: 35, color: 'black' }}>{username.charAt(0)}</Text>
          </View>
          <Text style={styles.profileHeaderText}>{this.state.member.username}</Text>
          <View style={styles.profileHeaderLine}></View>

        </View>
        <View>
          <Text style={styles.info}>
            {"\n"}
            Member ID:  {this.state.member.id}{"\n"}{"\n"}
            First Name: {this.state.member.fname}{"\n"}{"\n"}
            Last Name:  {this.state.member.lname}{"\n"}{"\n"}
            Email    :  {this.state.member.email}{"\n"}{"\n"}
            Phone No.:  {this.state.member.phone}{"\n"}{"\n"}
            Address:    {this.state.member.address}{"\n"}{"\n"}
            Reg. Date:  {this.state.member.reg_date}{"\n"}{"\n"}
          </Text>
          <View style={styles.buttonsContainer}>
            <Button
              title="LOG IN"
              buttonStyle={{
                backgroundColor: 'black',
                borderWidth: 2,
                borderColor: 'white',
                borderRadius: 30,
              }}
              containerStyle={{
                width: 200,
                marginHorizontal: 50,
                marginVertical: 10,
              }}
              titleStyle={{ fontWeight: 'bold' }}
              onPress={() => {
                props.navigation.toggleDrawer();
                Alert.alert(
                  'Logout',
                  'Are you sure? You want to logout?',
                  [
                    {
                      text: 'Cancel',
                      onPress: () => {
                        return null;
                      },
                    },
                    {
                      text: 'Confirm',
                      onPress: () => {
                        AsyncStorage.clear();
                        props.navigation.replace('Login');
                      },
                    },
                  ],
                  { cancelable: false },
                );
              }}
            />
          </View>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  body: {
    width: '100%',
    height: '100%',
    backgroundColor: 'pink',
    paddingTop: 40,
    color: 'white',
  },
  profileHeader: {
    flexDirection: 'row',
    backgroundColor: '#ffb6c1',
    padding: 15,
    textAlign: 'center',
    borderBottomWidth: 0.9,
    marginHorizontal: 20,
  },
  profileHeaderPicCircle: {
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
    color: 'white',
    backgroundColor: '#ffffff',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeaderText: {
    color: 'white',
    alignSelf: 'center',
    paddingHorizontal: 10,
    fontWeight: 'bold',
    fontSize: 30
  },
  profileHeaderLine: {
    height: 1,
    marginHorizontal: 20,
    backgroundColor: '#e2e2e2',
    marginTop: 15,
    color: 'black',
  },
  info: {
    fontSize: 15,
    backgroundColor: '#ffb6c1',
    fontWeight: "bold",
    marginHorizontal: 20,
    color: 'black',
  },
  buttonsContainer: {
    marginHorizontal: 20,
    height: 55,
  },
});
