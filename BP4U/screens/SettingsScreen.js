import React, {Component} from 'react';
import {View, Alert, Text, StyleSheet, Settings, Image} from 'react-native';
import SettingsList from 'react-native-settings-list';

export default class SettingsScreen extends Component {
  constructor() {
    super();
    this.state = {
      pushNotificationSettings: false,
      emailNotifications: false,
      newsletter: false,
      orderUpdates: false,
      BP4UPromotions: false,
      personalisedContent: false,
      privacyActivity: false,
    };
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={{backgroundColor: '#EFEFF4', flex: 1}}>
          <SettingsList borderColor="#EFEFF5" defaultItemSize={50}>
            <SettingsList.Header
              headerText="Push Notification Settings"
              headerStyle={{marginTop: 15}}
            />
            <SettingsList.Item
              icon={
                <Image
                  style={styles.imageStyle}
                  source={require('../assets/icons/push.png')}
                />
              }
              hasSwitch={true}
              switchState={this.state.pushNotificationSettings}
              switchOnValueChange={pushNotificationSettings =>
                this.setState({pushNotificationSettings})
              }
              hasNavArrow={false}
              title="Push Notifications"
            />
            <SettingsList.Item
              icon={
                <Image
                  style={styles.imageStyle}
                  source={require('../assets/icons/sound.png')}
                />
              }
              title="Notification Sound"
              hasSwitch={true}
              switchState={this.state.pushNotificationSettings}
              switchOnValueChange={pushNotificationSettings =>
                this.setState({pushNotificationSettings})
              }
              hasNavArrow={false}
            />
            <SettingsList.Item
              icon={
                <Image
                  style={styles.imageStyle}
                  source={require('../assets/icons/ringtone.png')}
                />
              }
              title="Ringtone"
              hasSwitch={true}
              switchState={this.state.pushNotificationSettings}
              switchOnValueChange={pushNotificationSettings =>
                this.setState({pushNotificationSettings})
              }
              hasNavArrow={false}
            />

            <SettingsList.Header
              headerText="Email Notification Settings"
              headerStyle={{marginTop: 15}}
            />
            <SettingsList.Item
              icon={
                <Image
                  style={styles.imageStyle}
                  source={require('../assets/icons/email.jpg')}
                />
              }
              title="Email Notifications"
              hasSwitch={true}
              switchState={this.state.emailNotifications}
              switchOnValueChange={emailNotifications =>
                this.setState({emailNotifications})
              }
              hasNavArrow={false}
            />
            <SettingsList.Item
              icon={
                <Image
                  style={styles.imageStyle}
                  source={require('../assets/icons/newsletter.png')}
                />
              }
              title="Newsletter"
              hasSwitch={true}
              switchState={this.state.newsletter}
              switchOnValueChange={newsletter => this.setState({newsletter})}
              hasNavArrow={false}
            />

            <SettingsList.Item
              icon={
                <Image
                  style={styles.imageStyle}
                  source={require('../assets/icons/order.png')}
                />
              }
              title="Order Updates"
              hasSwitch={true}
              switchState={this.state.orderUpdates}
              switchOnValueChange={orderUpdates =>
                this.setState({orderUpdates})
              }
              hasNavArrow={false}
            />
            <SettingsList.Item
              icon={
                <Image
                  style={styles.imageStyle}
                  source={require('../assets/icons/promo.png')}
                />
              }
              title="BP4U Promotions"
              hasSwitch={true}
              switchState={this.state.BP4UPromotions}
              switchOnValueChange={BP4UPromotions =>
                this.setState({BP4UPromotions})
              }
              hasNavArrow={false}
            />
            <SettingsList.Item
              icon={
                <Image
                  style={styles.imageStyle}
                  source={require('../assets/icons/personalised.png')}
                />
              }
              title="Personalised Content"
              hasSwitch={true}
              switchState={this.state.personalisedContent}
              switchOnValueChange={personalisedContent =>
                this.setState({personalisedContent})
              }
              hasNavArrow={false}
            />
            <SettingsList.Header
              headerText="Privacy Settings"
              headerStyle={{marginTop: 15}}
            />
            <SettingsList.Item
              icon={
                <Image
                  style={styles.imageStyle}
                  source={require('../assets/icons/privacy.png')}
                />
              }
              title="Privacy Activity"
              hasSwitch={true}
              switchState={this.state.privacyActivity}
              switchOnValueChange={privacyActivity =>
                this.setState({privacyActivity})
              }
              hasNavArrow={false}
            />
          </SettingsList>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  imageStyle: {
    marginLeft: 15,
    marginRight: 20,
    alignSelf: 'center',
    width: 20,
    height: 24,
    justifyContent: 'center',
  },
});
