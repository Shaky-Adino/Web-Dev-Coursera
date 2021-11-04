import React, { Component } from 'react';
import { ScrollView, Text, View, Image, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerItemList } from '@react-navigation/drawer';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { fetchDishes, fetchComments, fetchPromos, fetchLeaders } from '../redux/ActionCreators';

import About from './AboutComponent';
import Contact from './ContactComponent';
import Menu from './MenuComponent';
import Dishdetail from './DishdetailComponent';
import Home from './HomeComponent';
import Reservation from './ReservationComponent';

const mapStateToProps = state => {
    return {
      dishes: state.dishes,
      comments: state.comments,
      promotions: state.promotions,
      leaders: state.leaders
    }
  }
  
  const mapDispatchToProps = dispatch => ({
    fetchDishes: () => dispatch(fetchDishes()),
    fetchComments: () => dispatch(fetchComments()),
    fetchPromos: () => dispatch(fetchPromos()),
    fetchLeaders: () => dispatch(fetchLeaders()),
  })

const HeaderOptions = {
    headerStyle: {
        backgroundColor: "#512DA8"
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
        color: "#fff"            
    }
};

const CustomDrawerContentComponent = (props) => (
    <ScrollView>
        <View style={styles.drawerHeader}>
            <View style={{flex: 1}}>
                <Image 
                    source={require('./images/logo.png')}
                    style={styles.drawerImage}
                />
            </View>
            <View style={{flex: 2}}>
                <Text style={styles.drawerHeaderText}>
                    Ristorante Con Fusion
                </Text>
            </View>
        </View>
        <DrawerItemList {...props}/>
    </ScrollView>
);

const MenuNavigator = createStackNavigator();

function MenuNavigatorScreen() {
    return(
        <MenuNavigator.Navigator
            initialRouteName='Menu'
            screenOptions={HeaderOptions}
        >
            <MenuNavigator.Screen
                name="Menu"
                component={Menu}
                options={
                    ({navigation}) => ({
                        headerLeft: () => (
                            <Icon 
                                name='menu' 
                                size={24}
                                color='white'
                                onPress={() => 
                                    navigation.toggleDrawer()}
                            />
                        )
                    
                    })
                 }
            />
            <MenuNavigator.Screen
                name="Dishdetail"
                component={Dishdetail}
                options={{ headerTitle: "Dish Detail"}}
            />            
        </MenuNavigator.Navigator>
    );
}

const HomeNavigator = createStackNavigator();

function HomeNavigatorScreen() {
  return(
      <HomeNavigator.Navigator
          initialRouteName='Home'
          screenOptions={HeaderOptions}
      >
          <HomeNavigator.Screen
              name="Home"
              component={Home}
              options={
                    ({navigation}) => ({
                        headerLeft: () => (
                            <Icon 
                                name='menu' 
                                size={24}
                                color='white'
                                onPress={() => 
                                    navigation.toggleDrawer()}
                            />
                        )
                    
                    })
                 }
          />         
       </HomeNavigator.Navigator>
  );
}

const ContactNavigator = createStackNavigator();

function ContactNavigatorScreen() {
    return(
        <ContactNavigator.Navigator
          initialRouteName='Contact'
          screenOptions={HeaderOptions}
      >
          <ContactNavigator.Screen
              name="Contact"
              component={Contact}
              options={
                    ({navigation}) => ({
                        headerLeft: () => (
                            <Icon 
                                name='menu' 
                                size={24}
                                color='white'
                                onPress={() => 
                                    navigation.toggleDrawer()}
                            />
                        )
                    
                    })
                 }
          />         
       </ContactNavigator.Navigator>
    );
}

const AboutNavigator = createStackNavigator();

function AboutNavigatorScreen() {
    return(
        <AboutNavigator.Navigator
          initialRouteName='About Us'
          screenOptions={HeaderOptions}
      >
          <AboutNavigator.Screen
              name="About Us"
              component={About}
              options={
                    ({navigation}) => ({
                        headerLeft: () => (
                            <Icon 
                                name='menu' 
                                size={24}
                                color='white'
                                onPress={() => 
                                    navigation.toggleDrawer()}
                            />
                        )
                    
                    })
                 }
          />         
       </AboutNavigator.Navigator>
    );
}

const ReservationNavigator = createStackNavigator();

function ReservationNavigatorScreen() {
    return(
        <ReservationNavigator.Navigator
          initialRouteName='Reserve Table'
          screenOptions={HeaderOptions}
      >
          <ReservationNavigator.Screen
              name="Reserve Table"
              component={Reservation}
              options={
                    ({navigation}) => ({
                        headerLeft: () => (
                            <Icon 
                                name='menu' 
                                size={24}
                                color='white'
                                onPress={() => 
                                    navigation.toggleDrawer()}
                            />
                        )
                    
                    })
                 }
          />         
       </ReservationNavigator.Navigator>
    );
}

const Drawer = createDrawerNavigator();

function MainNavigator() {
    return(

        <Drawer.Navigator drawerStyle={{backgroundColor: '#D1C4E9'}} initialRouteName="Home" drawerContent={props => <CustomDrawerContentComponent {...props}/>}>
          <Drawer.Screen name="Home" component={HomeNavigatorScreen} options={{
                    drawerIcon: ({color}) => (
                        <Icon
                            name='home'
                            type='font-awesome'
                            size={24}
                            color={color}
                        />
                    )
                }}/>
          <Drawer.Screen name="About Us" component={AboutNavigatorScreen} options={{
                    drawerIcon: ({color}) => (
                        <Icon
                            name='info-circle'
                            type='font-awesome'
                            size={24}
                            color={color}
                        />
                    )
                }}/>
          <Drawer.Screen name="Menu" component={MenuNavigatorScreen} options={{
                    drawerIcon: ({color}) => (
                        <Icon
                            name='list'
                            type='font-awesome'
                            size={24}
                            color={color}
                        />
                    )
                }} />
          <Drawer.Screen name="Contact Us" component={ContactNavigatorScreen} options={{
                    drawerIcon: ({color}) => (
                        <Icon
                            name='address-card'
                            type='font-awesome'
                            size={22}
                            color={color}
                        />
                    )
                }}/>
            <Drawer.Screen name="Reserve Table" component={ReservationNavigatorScreen} options={{
                    drawerIcon: ({color}) => (
                        <Icon
                            name='cutlery'
                            type='font-awesome'
                            size={22}
                            color={color}
                        />
                    )
                }}/>
        </Drawer.Navigator>

    );
}

class Main extends Component {

  componentDidMount() {
        this.props.fetchDishes();
        this.props.fetchComments();
        this.props.fetchPromos();
        this.props.fetchLeaders();
  }

  render() {
 
    return (
        <NavigationContainer>
            
                <MainNavigator />
                    
        </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    drawerHeader: {
      backgroundColor: '#512DA8',
      height: 140,
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      flexDirection: 'row'
    },
    drawerHeaderText: {
      color: 'white',
      fontSize: 24,
      fontWeight: 'bold'
    },
    drawerImage: {
      margin: 10,
      width: 80,
      height: 60
    }
  });
  
export default connect(mapStateToProps, mapDispatchToProps)(Main);