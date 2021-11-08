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
  TouchableOpacity
} from "react-native";
import { Icon } from 'react-native-elements';
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Animatable from 'react-native-animatable';

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
          onPress: () => this.resetForm()
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