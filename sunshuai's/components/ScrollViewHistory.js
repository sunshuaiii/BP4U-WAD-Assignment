import React, {Component} from 'react';
import Ionicons from 'react-native-vector-icons/MaterialIcons';
import {
  StyleSheet,
  ScrollView,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';

const ScrollViewHistory = ({
  isFetching,
  loadOrderHistory,
  orderHistory,
  navigation,
}) => {
  return (
    <ScrollView>
      <FlatList
        style={styles.orderListContainer}
        refreshing={isFetching}
        onRefresh={loadOrderHistory}
        data={orderHistory}
        renderItem={({item, index}) => {
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => {
                navigation.navigate('OrderItem', {
                  orderID: item.id,
                });
              }}>
              <View style={styles.infoContainer}>
                <Text style={styles.orderID}>{item.id}</Text>
                <Text style={styles.status}>{item.status}</Text>
                <View style={styles.iconInline}>
                  <Ionicons name="local-shipping" size={22} color={'black'} />
                  <Text style={styles.iconText}>Shipping Information</Text>
                </View>
                <Text style={styles.infoText}>Name: {item.member_name}</Text>
                <Text style={styles.infoText}>
                  Phone No: {item.member_phone}
                </Text>
                <Text style={styles.infoText}>
                  Address: {item.ship_address}
                </Text>
                <Text style={styles.iconText}>{'\n\n\n'}Summary Amount</Text>
                <Text style={styles.infoText}>Subtotal: RM {item.total}</Text>
                <Text style={styles.infoText}>
                  Shipping fee: RM {item.ship_fee}
                </Text>
                <Text style={styles.infoText}>
                  Order Total: RM {item.total + item.ship_fee}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}></FlatList>
    </ScrollView>
  );
};

export default ScrollViewHistory;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'lightpink',
    paddingBottom: '5%',
    marginBottom: '5%',
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 18,
  },
  container: {
    backgroundColor: 'lightpink',
    paddingBottom: '15%',
    marginBottom: '15%',
  },
  logo: {
    width: 65,
    height: 65,
    padding: 5,
  },
  title: {
    width: '100%',
    marginTop: 20,
    fontSize: 25,
    fontWeight: 'bold',
    marginLeft: '10%',
  },
  orderListContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: 'mistyrose',
    borderRadius: 16,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowColor: 'black',
    shadowOffset: {
      height: 0,
      width: 0,
    },
  },
  infoContainer: {
    padding: 16,
  },
  orderID: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: 'bold',
  },
  status: {
    marginTop: 5,
    fontSize: 15,
    fontWeight: 'bold',
  },
  iconInline: {
    textAlign: 'row',
  },
  iconText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 15,
    fontWeight: '600',
    textDecorationStyle: 'solid',
  },
  attribute: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
});

module.exports = {
  ScrollViewHistory: ScrollViewHistory,
};
