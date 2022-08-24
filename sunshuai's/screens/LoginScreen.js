import React, {useState} from 'react';

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

export default function LoginScreen() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const setData = () => {
    console.log(name);
    if (name.length == 0) {
      Alert.alert('Please key in your username');
    } else {
      try {
        AsyncStorage.setItem('UserName', name);
      } catch (error) {}
    }
  };

  return (
    <View style={styles.body}>
      <Image
        style={styles.logo}
        source={require('../assets/icons/BP4U.png')}></Image>
      <Text style={styles.txt}>BP4U</Text>
      <TextInput
        style={styles.input}
        // onChangeText={(UserEmail) =>
        //   setUserEmail(UserEmail)
        // }
        placeholder="Enter Username"
        placeholderTextColor="#fffafa"
        autoCapitalize="none"
        keyboardType="default"
        returnKeyType="next"
        onChangeText={value => {
          setName(value);
        }}
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
          onChangeText={value => setPassword(value)}
          // ref={passwordInputRef}
          // onSubmitEditing={Keyboard.dismiss}
          blurOnSubmit={false}
          secureTextEntry={true}
          underlineColorAndroid="#f000"
          returnKeyType="next"
        />
      </View>
      {/* {errortext != '' ? (
              <Text style={styles.errorTextStyle}>
                {errortext}
              </Text>
            ) : null}
            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={handleSubmitPress}>
              <Text style={styles.buttonTextStyle}>LOGIN</Text>
            </TouchableOpacity> */}
      <Text
        style={styles.registerTextStyle}
        onPress={() => props.navigation.navigate('HomeScreen')}>
        New Here ? Register
      </Text>

      <Button
        style={styles.bttn}
        title="LOGIN"
        // onPressFunction={setData}
        onPress={setData}
        // onPress={() => Alert.alert('Welcome !!! ' + name)}
      />
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
    borderColor: '#000000',
    borderWidth: 1,
    borderRadiius: 10,
    backgroundColor: '#ffb6',
    textAlign: 'center',
    frontSize: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  input2: {
    width: 300,
    borderColor: '#000000',
    borderWidth: 1,
    borderRadiius: 10,
    backgroundColor: '#ffb6',
    textAlign: 'center',
    frontSize: 20,
    marginTop: 0,
    marginBottom: 10,
  },
  bttn: {
    width: 100,
    height: 50,
    alignItems: 'center',
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
