import React, { useState } from "react";
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
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SQLite from "react-native-sqlite-storage";

let config = require("../Config");

const db = SQLite.openDatabase(
  {
    name: "bp4udb",
    location: "~bp4u.sqlite",
  },
  () => {},
  (error) => {
    console.log(error);
  }
);

const RegisterScreen = ({ navigation }) => {
  const [name, setUserName] = useState("");
  const [password, setUserPassword] = useState("");
  const [email, setUserEmail] = useState("");
  const [address, setUserAddress] = useState("");
  const [phone, setUserPhone] = useState("");

  // const block =()=>{
  //   return name != '' && password != '' && email != '' && address != '' && phone != '' &&
  // }

  let registration = () => {
    console.log(name, password, email, address, phone);

    if (!name) {
      Alert.alert("Please fill name");
      return;
    }
    if (!password) {
      Alert.alert("Please fill password");
      return;
    }
    if (!email) {
      Alert.alert("Please fill email");
      return;
    }
    if (!address) {
      Alert.alert("Please fill address");
      return;
    }
    if (!phone) {
      Alert.alert("Please fill your phone number");
      return;
    }

    db.transaction(function (tx) {
      tx.executeSql(
        "INSERT INTO table_user (name, password, email, address, phone) value (?,?,?,?,?)",
        [name, password, email, address, phone],
        (tx, results) => {
          console.log("Results", results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert(
              "Success",
              "You are Registered Successfully",
              [
                {
                  text: "Ok",
                  onPress: () => navigation.navigate("Profile"),
                },
              ],
              { cancelable: false }
            );
          } else alert("Registration Failed");
        }
      );
    });
  };
  // const checkUserRegister = (email) =>{
  //   db.transaction(txn =>{
  //     txn.executeSQL(
  //       "select * from member where email = (?)",
  //       [email],
  //       (sqlTxn, res) =>{
  //         if(res.rows.length >= 1){
  //           console.log(" account exist ")
  //           // ToastAndroid.show("account exist",toastAndroid.SHORT);
  //           Alert.alert('user exist')
  //         }else{
  //           try{
  //             await db.transaction(async(tx)=>{
  //               await tx.executeSql(
  //                 "insert into member (name, password, email, address, phone) value (?,?,?,?,?)",
  //                 [name,password,email,address,phone],
  //               );
  //             })
  //             navigation.navigate('Home')
  //           }catch(error){
  //             console.log(error);
  //           }
  //         }
  //           // error =>{console.log(error);
  //         // }
  //       }
  //     )
  //   })
  // }
  // const createUser = (name, password, email, address, phone)=>{
  //   console.log(name + password + email + address + phone)
  //   db.transaction(txn=>{

  //     txn.executeSql(
  //       "insert into member (name, password, email, address, phone) value (?,?,?,?,?)",
  //       [name,password,email,address,phone],
  //       (sqlTxn,res)=>{
  //         console.log('data inserted')
  //       },
  //       error => {
  //         console.log('## error user data not inserted ## ',error);
  //       }
  //     )

  //   })
  // }

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      <KeyboardAvoidingView enabled>
        <View style={styles.body}>
          <Image
            style={styles.logo}
            source={require("../assets/icons/BP4U.png")}
          />
          <Text style={styles.txt}>BP4U</Text>
          <TextInput
            style={styles.input}
            // onChangeText={(UserEmail) =>
            //   setUserName(UserName)
            // }
            placeholder="Enter Username"
            placeholderTextColor="#fffafa"
            autoCapitalize="none"
            keyboardType="default"
            returnKeyType="next"
            onChangeText={(value) => {
              setUserName(value);
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
              onChangeText={(value) => setUserPassword(value)}
              // ref={passwordInputRef}
              // onSubmitEditing={Keyboard.dismiss}
              blurOnSubmit={false}
              secureTextEntry={true}
              underlineColorAndroid="#f000"
              returnKeyType="next"
            />
          </View>
          <View style={styles.txt}>
            <TextInput
              style={styles.input2}
              // onChangeText={(UserPassword) =>
              //   setUserPassword(UserPassword)
              // }
              placeholder="Enter your Email-Address"
              placeholderTextColor="#fffafa"
              keyboardType="email-address"
              onChangeText={(value) => setUserEmail(value)}
              // ref={passwordInputRef}
              // onSubmitEditing={Keyboard.dismiss}
              blurOnSubmit={false}
              secureTextEntry={false}
              underlineColorAndroid="#f000"
              returnKeyType="next"
            />
          </View>
          <View style={styles.txt}>
            <TextInput
              style={styles.input2}
              // onChangeText={(UserPassword) =>
              //   setUserPassword(UserPassword)
              // }
              placeholder="Enter your Address"
              placeholderTextColor="#fffafa"
              keyboardType="default"
              onChangeText={(value) => setUserAddress(value)}
              // ref={passwordInputRef}
              // onSubmitEditing={Keyboard.dismiss}
              blurOnSubmit={false}
              secureTextEntry={false}
              underlineColorAndroid="#f000"
              returnKeyType="next"
            />
          </View>
          <View style={styles.txt}>
            <TextInput
              style={styles.input2}
              // onChangeText={(UserPassword) =>
              //   setUserPassword(UserPassword)
              // }
              placeholder="Enter your Phone Number"
              placeholderTextColor="#fffafa"
              keyboardType="numeric"
              onChangeText={(value) => setUserPhone(value)}
              // ref={passwordInputRef}
              // onSubmitEditing={Keyboard.dismiss}
              blurOnSubmit={false}
              secureTextEntry={false}
              underlineColorAndroid="#f000"
              returnKeyType="next"
            />
          </View>
          <View style={styles.bttn}>
            <Button
              loading={false}
              title="Register"
              // disabled={block() ? false : true}
              // onPressFunction={setData}
              // onPress={setData}
              onPress={() => {
                registration;
              }}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#ff1493",
  },
  logo: {
    width: 70,
    height: 70,
    margin: 10,
  },
  txt: {
    fontSize: 25,
    color: "#000000",
  },
  input: {
    width: 300,
    height: 40,
    borderColor: "#000000",
    borderWidth: 1,
    borderRadiius: 10,
    backgroundColor: "#ffb6",
    textAlign: "center",
    frontSize: 20,
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 30,
  },
  input2: {
    width: 300,
    height: 40,
    borderColor: "#000000",
    borderWidth: 1,
    borderRadiius: 10,
    backgroundColor: "#ffb6",
    textAlign: "center",
    frontSize: 20,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 30,
  },
  bttn: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  registerTextStyle: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 14,
    alignSelf: "center",
    padding: 10,
  },
});
