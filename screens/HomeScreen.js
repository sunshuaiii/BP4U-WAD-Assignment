import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableHighlight} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {FloatingAction} from 'react-native-floating-action';


// not done
let common = require('../CommonData');
let SQLite = require('react-native-sqlite-storage');

const actions = [
  {
    text: 'Add',
    icon: require('../assets/icons/add.png'),
    name: 'add',
    position: 1,
  },
];

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      students: [],
    };
    this._query = this._query.bind(this);
    this._databasePrepare = this._databasePrepare.bind(this);
    this.db = SQLite.openDatabase(
      {name: 'studentdb2'},
      this.openCallback,
      this.errorCallback,
    );
  }
  componentDidMount() {
    this._databasePrepare();
    this._query();
  }
  _databasePrepare() {
    this.db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS students(id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(20), email VARCHAR(20), state VARCHAR(20))',
        [],
        (sqlTxn, res) => {
          console.log('students table ready');
        },
        error => {
          console.log('error on creating table ' + error.message);
        },
      );
      this.db.transaction(tx =>
        tx.executeSql(
          'SELECT * FROM students ORDER BY name',
          [],
          (tx, results) => {
            if (results.rows.length == 0) {
              tx.executeSql(
                'INSERT INTO students(name,email,state) VALUES("Chia Kim Hooi","chiakh@duckmail.com","07")',
                [], //insert dummy data so that the database is non-empty, to ease verification
                (tx, results) => {
                  if (results.rowsAffected > 0) {
                    console.log('dummy data inserted successfully');
                    this._query();
                  } else {
                    console.log('error in inserting data');
                  }
                },
              );
            } else {
              console.log('table non-empty, no insertion needed');
            }
          },
        ),
      );
    });
  }

  _query() {
    this.db.transaction(tx =>
      tx.executeSql('SELECT * FROM students ORDER BY name', [], (tx, results) =>
        this.setState({students: results.rows.raw()}),
      ),
    );
  }

  openCallback() {
    console.log('database open success');
  }
  errorCallback(err) {
    console.log('Error in opening the database: ' + err);
  }
  render() {
    console.log(this.state.students);
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.students}
          extraData={this.state}
          showsVerticalScrollIndicator={true}
          renderItem={({item}) => (
            <TouchableHighlight
              underlayColor="pink"
              onPress={() => {
                this.props.navigation.navigate('ViewScreen', {
                  id: item.id,
                  headerTitle: item.name,
                  refresh: this._query,
                });
              }}>
              <View style={styles.item}>
                <Text style={styles.itemTitle}>{item.name}</Text>
                <Text style={styles.itemSubtitle}>
                  {common.getValue(common.states, item.state)}
                </Text>
              </View>
            </TouchableHighlight>
          )}
          keyExtractor={item => {
            item.id.toString();
          }}
        />
        <FloatingAction
          actions={actions}
          overrideWithAction={true}
          color={'#a80000'}
          onPressItem={() => {
            this.props.navigation.navigate('CreateScreen', {
              refresh: this._query,
            });
          }}
        />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
  },
  item: {
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 25,
    paddingRight: 25,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  itemTitle: {
    fontSize: 22,
    fontWeight: '500',
    color: '#000',
  },
  itemSubtitle: {
    fontSize: 18,
  },
});
