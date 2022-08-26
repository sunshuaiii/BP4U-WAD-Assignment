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
  ToastAndroid,

} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

let common = require('../CommonData');
let SQLite = require('react-native-sqlite-storage');

export default class RegisterScreen extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      member_username: '',
      member_first_name: '',
      member_last_name: '',
      member_password: '',
      member_email: '',
      member_address: '',
    };
    this._insert = this._insert.bind(this);
    this.db = SQLite.openDatabase(
      {
        name: 'profile',
      },
      this.openCallback,
      this.errorCallback,
    );
  }

  componentDidMount() {
    this.props.navigation.setOptions({ headerTitle: 'Register' });
  }

  _insert() {
    this.db.transaction(tx => {
      tx.executeSql('INSERT INTO member(member_username,member_first_name,member_last_name,member_password,member_email,member_phone,member_address) VALUES(?,?,?)', [
        this.state.member_username,
        this.state.member_first_name,
        this.state.member_last_name,
        this.state.member_password,
        this.state.member_email,
        this.state.member_phone,
        this.state.member_address,
      ],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Success',
              'You are Registered Successfully',
              [
                {
                  text: 'Ok',
                  onPress: () => navigation.navigate('Login'),
                },
              ],
              { cancelable: false }
            );
          } else alert('Registration Failed');
        }
      );
    });
    // this.props.route.params.refresh();
    // this.props.navigation.goBack();
  }

  openCallback() {
    console.log('database open successfully');
  }
  errorCallback(err) {
    console.log('Error in opening the database: ' + err);
  }

  render() {
    let member = this.state.member;

    return (
      <ScrollView keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        <KeyboardAvoidingView enabled>
          <View style={styles.body}>
            <Image
              style={styles.logo}
              source={require('../assets/icons/BP4U.png')}
            />
            <Text style={styles.txt}>BP4U</Text>
            <TextInput
              style={styles.input}
              placeholder={"Enter Username"}
              placeholderTextColor={"#fffafa"}
              autoCapitalize={"none"}
              keyboardType={"default"}
              returnKeyType={"next"}
              underlineColorAndroid={"#f000"}
              blurOnSubmit={false}
              value={this.state.member_username}
              onChangeText={member_username => {
                this.setState({ member_username });
              }}
            />
            <View style={styles.txt}>
              <TextInput
                style={styles.input2}
                placeholder={"Enter your First Name"}
                placeholderTextColor={"#fffafa"}
                keyboardType={"default"}
                blurOnSubmit={false}
                secureTextEntry={false}
                underlineColorAndroid={"#f000"}
                returnKeyType={"next"}
                value={this.state.member_first_name}
                onChangeText={member_first_name => {
                  this.setState({ member_first_name });
                }}
              />
            </View>
            <View style={styles.txt}>
              <TextInput
                style={styles.input2}
                placeholder={"Enter your Last Name"}
                placeholderTextColor={"#fffafa"}
                keyboardType={"default"}
                blurOnSubmit={false}
                secureTextEntry={false}
                underlineColorAndroid={"#f000"}
                returnKeyType={"next"}
                value={this.state.member_last_name}
                onChangeText={member_last_name => {
                  this.setState({ member_last_name });
                }}
              />
            </View>

            <View style={styles.txt}>
              <TextInput
                style={styles.input2}
                placeholder={"Enter Password"}
                placeholderTextColor={"#fffafa"}
                keyboardType={"default"}
                blurOnSubmit={false}
                secureTextEntry={true}
                underlineColorAndroid={"#f000"}
                returnKeyType={"next"}
                value={this.state.member_password}
                onChangeText={member_password => {
                  this.setState({ member_password });
                }}
              />
            </View>
            <View style={styles.txt}>
              <TextInput
                style={styles.input2}
                placeholder={"Enter your Email-Address"}
                placeholderTextColor={"#fffafa"}
                keyboardType={"email-address"}
                blurOnSubmit={false}
                secureTextEntry={false}
                underlineColorAndroid={"#f000"}
                returnKeyType={"next"}
                value={this.state.member_email}
                onChangeText={member_email => {
                  this.setState({ member_email });
                }}
              />
            </View>
            <View style={styles.txt}>
              <TextInput
                style={styles.input2}
                placeholder={"Enter your Address"}
                placeholderTextColor={"#fffafa"}
                keyboardType={"default"}
                blurOnSubmit={false}
                secureTextEntry={false}
                underlineColorAndroid={"#f000"}
                returnKeyType={"next"}
                value={this.state.member_address}
                onChangeText={member_address => {
                  this.setState({ member_address });
                }}
              />
            </View>
            <View style={styles.txt}>
              <TextInput
                style={styles.input2}
                placeholder={"Enter your Phone Number"}
                placeholderTextColor={"#fffafa"}
                keyboardType={"numeric"}
                blurOnSubmit={false}
                secureTextEntry={false}
                underlineColorAndroid={"#f000"}
                returnKeyType={"next"}
                value={this.state.member_phone}
                onChangeText={member_phone => {
                  this.setState({ member_phone });
                }}
              />
            </View>
            <View style={styles.bttn}>
              <Button
                style={styles.button}
                title={'Register'}
                onPress={this._insert}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>


    );
  }
}
const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#ff1493',
  },
  logo: {
    width: 70,
    height: 70,
    margin: 10,
  },
  txt: {
    fontSize: 25,
    color: '#000000',
  },
  input: {
    width: 300,
    height: 40,
    borderColor: '#000000',
    borderWidth: 1,
    borderRadiius: 10,
    backgroundColor: '#ffb6',
    textAlign: 'center',
    frontSize: 20,
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 30,
  },
  input2: {
    width: 300,
    height: 40,
    borderColor: '#000000',
    borderWidth: 1,
    borderRadiius: 10,
    backgroundColor: '#ffb6',
    textAlign: 'center',
    frontSize: 20,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 30,
  },
  bttn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 2,
    marginTop: 20,
  },
  registerTextStyle: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    alignSelf: 'center',
    padding: 10,
  },
});

