import React, { Component } from "react";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Picker,
  Switch,
  Button,
  Alert,
  TouchableOpacity,
  Platform
} from "react-native";
import { Icon } from 'react-native-elements';
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Animatable from 'react-native-animatable';
import * as Permissions from 'expo-permissions';
import {Notifications} from 'expo';
import Constants from 'expo-constants';
import * as Calendar from 'expo-calendar';

class Reservation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      guests: 1,
      smoking: false,
      date: new Date(),
      time: new Date(),
      show: false,
      mode: "date",
    };
  }

  handleReservation() {
    Alert.alert(
      'Your Reservation OK?',
      'Number of Guests: ' + this.state.guests + '\n' +
        'Smoking? ' + this.state.smoking + '\n' +
        'Date and Time: ' + this.state.date.toDateString() + '\n' + this.state.time.toTimeString()
      ,
      [
        {
          text: 'Cancel',
          onPress: () => this.resetForm(),
          style: ' cancel'
        },
        {
          text: 'Ok',
          onPress: () => {
            this.addReservationToCalendar(this.state.date);
            this.presentLocalNotification(this.state.date);
            this.resetForm()}
        },
      ],
      { cancelable: false }
    );
  }

  resetForm() {
    this.setState({
      guests: 1,
      smoking: false,
      date: new Date(),
      time: new Date(),
      show: false,
      mode: "date",
    });
  }

  async obtainCalendarPermission() {
    let permission = await Permissions.getAsync(Permissions.CALENDAR);
    if (permission.status !== 'granted') {
        permission = await Permissions.askAsync(Permissions.CALENDAR);
        if (permission.status !== 'granted') {
            Alert.alert('Permission not granted to use calendar');
        }
    }
    return permission;
  }

  async getDefaultCalendarSource() {
    const calendars = await Calendar.getCalendarsAsync();
    const defaultCalendars = calendars.filter(each => each.source.name === 'Default');
    return defaultCalendars[0].source;
  }

  async getDefaultCalendarId() {
    const defaultCalendarSource =
    Platform.OS === 'ios'
      ? await getDefaultCalendarSource()
      : { isLocalAccount: true, name: 'Expo Calendar' };
    const newCalendarID = await Calendar.createCalendarAsync({
      title: 'Expo Calendar',
      color: 'blue',
      entityType: Calendar.EntityTypes.EVENT,
      sourceId: defaultCalendarSource.id,
      source: defaultCalendarSource,
      name: 'internalCalendarName',
      ownerAccount: 'personal',
      accessLevel: Calendar.CalendarAccessLevel.OWNER,
    });

    return newCalendarID;

  }

  async addReservationToCalendar(date) {
    await this.obtainCalendarPermission();
    const defaultCalendarId = await this.getDefaultCalendarId();

    Calendar.createEventAsync(defaultCalendarId, {
      title: 'Con Fusion Table Reservation',
      startDate: new Date(Date.parse(date)),
      endDate: new Date(Date.parse(date) + (2*60*60*1000)),
      timeZone: 'Asia/Hong_Kong',
      location: '121, Clear Water Bay Road, Clear Water Bay, Kowloon, Hong Kong'
    });
  }

async obtainNotificationPermission() {
  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      Alert.alert('Failed to get push token for push notification!');
      return;
    }
  } else {
    Alert.alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
      Notifications.createChannelAndroidAsync('notify', {
        name: 'notify',
        sound: true,
        vibrate: true,
    });
  }

  return ;
}

async presentLocalNotification(date) {
    await this.obtainNotificationPermission();
    Notifications.presentLocalNotificationAsync({
        title: 'Your Reservation',
        body: 'Reservation for '+ date + ' requested',
        ios: {
            sound: true
        },
        android: {
            channelId: "notify",
            sound: true,
            vibrate: true,
            color: '#512DA8'
        }
    });
}

  render() {
    const showDatepicker = () => {
      this.setState({ show: true });
    };
    return (
      <ScrollView>
      <Animatable.View animation="zoomIn" duration={2000}>
        <View style={styles.formRow}>
          <Text style={styles.formLabel}>Number of Guests</Text>
          <Picker
            style={styles.formItem}
            selectedValue={this.state.guests}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({ guests: itemValue })
            }
          >
            <Picker.Item label="1" value="1" />
            <Picker.Item label="2" value="2" />
            <Picker.Item label="3" value="3" />
            <Picker.Item label="4" value="4" />
            <Picker.Item label="5" value="5" />
            <Picker.Item label="6" value="6" />
          </Picker>
        </View>
        <View style={styles.formRow}>
          <Text style={styles.formLabel}>Smoking/Non-Smoking?</Text>
          <Switch
            style={styles.formItem}
            value={this.state.smoking}
            trackColor="#512DA8"
            onValueChange={(value) => this.setState({ smoking: value })}
          ></Switch>
        </View>
        <View style={styles.formRow}>
          <Text style={styles.formLabel}>Date and Time</Text>
          <TouchableOpacity style={styles.formItem}
            style={{
                padding: 7,
                borderColor: '#512DA8',
                borderWidth: 2,
                // flexDirection: "row"
            }}
            onPress={showDatepicker}
          >
          <Icon type='font-awesome' name='calendar' color='#512DA8' />
          <Text style={{marginLeft:25}}>
            {this.state.date.toDateString()}
          </Text>
          <Text>
            {this.state.time.toTimeString()}
          </Text>
      </TouchableOpacity>
          
          {this.state.show && (
            <DateTimePicker
              value={this.state.date}
              mode={this.state.mode}
              display="default"
              minimumDate={new Date()}
              onChange={(selected, value) => {
                if (value !== undefined) {
                  this.setState({
                    show: this.state.mode === "time" ? false : true,
                    mode: "time",
                    date: new Date(selected.nativeEvent.timestamp),
                    time: new Date(selected.nativeEvent.timestamp),
                  });
                } else {
                  this.setState({ show: false });
                }
              }}
            />
          )}
        </View>
        <View style={styles.formRow}>
          <Button
            onPress={() => this.handleReservation()}
            title="Reserve"
            color="#512DA8"
            accessibilityLabel="Learn more about this purple button"
          />
        </View>
        </Animatable.View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  formRow: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    flexDirection: "row",
    margin: 20,
  },
  formLabel: {
    fontSize: 18,
    flex: 2,
  },
  formItem: {
    flex: 1,
  }
});

export default Reservation;