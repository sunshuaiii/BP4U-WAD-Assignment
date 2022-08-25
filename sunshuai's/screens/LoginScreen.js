import React, {Component, useState} from 'react';
// import React, {useState} from 'react';
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
import {TextInput} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SQLite from 'react-native-sqlite-storage';
let config = require("../Config");
const db=SQLite.openDatabase(
  {
    name: 'bp4udb',
  location: '~bp4u.sqlite',
},
() => {},
error => {console.log(error)}
);

export default function LoginScreen({navigation}) {
  const [name, setUserName] = useState('');
  const [password, setUserPassword] = useState('');

  const setData = async () => {
    if (name.length == 0) {
      Alert.alert('Please key in your username');
    } else {
      try {
        await AsyncStorage.setItem('UserName', name);
        navigation.navigate('Profile');
      } catch (error) {
        console.log(error);
      }
    }
  };
 
  // const checkUser = async(name, password) =>{
  //   try{
  //     let url = config.settings.serverPath + '/api/member';
  //     const response = await fetch(url)
  //     const data = await response.json()
  //   }
  // }

  return (
    <View style={styles.body}>
      <Image
        style={styles.logo}
        source={require('../assets/icons/BP4U.png')}
      />
      <Text style={styles.txt}>BP4U</Text>
      <ScrollView keyboardShouldPersistTaps="handled">
      <KeyboardAvoidingView enabled>
        <TextInput
          style={styles.input}
          placeholder="Enter Username"
          placeholderTextColor="#fffafa"
          autoCapitalize="none"
          keyboardType="default"
          returnKeyType="next"
          onChangeText={(value) => setUserName(value)}
          // onSubmitEditing={() =>
          //   passwordInputRef.current &&
          //   passwordInputRef.current.focus()
          // }
          underlineColorAndroid="#f000"
          blurOnSubmit={false}
        />

        <View style={styles.txt}>
          <TextInput
            style={styles.input2}
            // onChangeText={(UserPassword) =>
            //   setUserPassword(UserPassword)
            // }
            placeholder="Enter Password"
            placeholderTextColor="#fffafa"
            keyboardType="default"
            onChangeText={value => setUserPassword(value)}
            // ref={passwordInputRef}
            // onSubmitEditing={Keyboard.dismiss}
            blurOnSubmit={false}
            secureTextEntry={true}
            underlineColorAndroid="#f000"
            returnKeyType="next"
          />
        </View>
        <Text
          style={styles.registerTextStyle}
          onPress={() => navigation.navigate('Register')}>
          New Here ? Register
        </Text>
        <View style = {styles.bttn}>
        <Button
        loading={false}
        title="LOG IN"
          // style={styles.bttn}
          // onPressFunction={setData}
          onPress={setData}
          onPress={() => checkUser(name, password)}
        />
        </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#ff1493',
  },
  logo: {
    width: 100,
    height: 100,
    margin: 20,
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
    marginTop: 0,
    marginBottom: 10,
    borderRadius: 30,
  },
  bttn: {
    width:'100%',
    justifyContent:'center',
    alignItems: 'center',
    marginTop: 10,
    
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