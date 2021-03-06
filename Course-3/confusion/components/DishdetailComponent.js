import React, { Component } from 'react';
import {
    Text,
    View,
    ScrollView,
    FlatList,
    Modal,
    StyleSheet,
    Button,
    Alert,
    PanResponder,
    Share
  } from "react-native";
import { Card, Icon, Input, Rating } from "react-native-elements";
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from "../redux/ActionCreators";
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
      dishes: state.dishes,
      comments: state.comments,
      favorites: state.favorites
    }
  }

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId, rating, author, comment) =>
      dispatch(postComment(dishId, rating, author, comment))
})

function RenderDish(props) {

    handleViewRef = ref => this.view = ref;

    const dish = props.dish;

    const recognizeDrag = ({ moveX, moveY, dx, dy }) => {
        if ( dx < -200 )
            return true;
        else
            return false;
    };

    const recognizeComment = ({ moveX, moveY, dx, dy }) => {
        if (dx > 200)
          return true;
        else
          return false;
    };

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (e, gestureState) => {
            return true;
        },
        onPanResponderGrant: () => {
            this.view.rubberBand(1000).then(endState => console.log(endState.finished ? 'finished' : 'cancelled'));
        },
        onPanResponderEnd: (e, gestureState) => {
            if (recognizeDrag(gestureState)){
                Alert.alert(
                    'Add Favorite',
                    'Are you sure you wish to add ' + dish.name + ' to favorite?',
                    [
                    {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                    {text: 'OK', onPress: () => {props.favorite ? console.log('Already favorite') : props.onPress()}},
                    ],
                    { cancelable: false }
                );
            } else if (recognizeComment(gestureState)) {
                props.onPressAddComment();
            }

            return true;
        }
    })
    
    const shareDish = (title, message, url) => {
        Share.share({
            title: title,
            message: title + ': ' + message + ' ' + url,
            url: url
        },{
            dialogTitle: 'Share ' + title
        })
    }

        if (dish != null) {
            return(
                <Animatable.View animation="fadeInDown" duration={2000} delay={1000}
                ref={this.handleViewRef}
                {...panResponder.panHandlers}>
                <Card
                featuredTitle={dish.name}
                image={{uri: baseUrl + dish.image}}>
                    <Text style={{margin: 10}}>
                        {dish.description}
                    </Text>

                    <View style={styles.formRow}>
                    <Icon
                        raised
                        reverse
                        name={ props.favorite ? 'heart' : 'heart-o'}
                        type='font-awesome'
                        color='#f50'
                        onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()}
                    />
                    <Icon
                        raised
                        reverse
                        name="pencil"
                        type="font-awesome"
                        color="#512DA8"
                        onPress={props.onPressAddComment}
                    />
                    <Icon
                            raised
                            reverse
                            name='share'
                            type='font-awesome'
                            color='#51D2A8'
                            style={styles.cardItem}
                            onPress={() => shareDish(dish.name, dish.description, baseUrl + dish.image)} 
                    />
                    </View>
                </Card>
                </Animatable.View> 
            );
        }
        else {
            return(<View></View>);
        }
}

function RenderComments(props) {

    const comments = props.comments;
            
    const renderCommentItem = ({item, index}) => {
        
        return (
            <View key={index} style={{margin: 10}}>
                <Text style={{fontSize: 14}}>{item.comment}</Text>
                <Rating
                    imageSize={15}
                    readonly
                    startingValue={item.rating}
                    style={{ alignItems: "flex-start" }}
                />
                <Text style={{fontSize: 12}}>{'-- ' + item.author + ', ' + item.date} </Text>
            </View>
        );
    };
    
    return (
        <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>  
        <Card title='Comments' >
        <FlatList 
            data={comments}
            renderItem={renderCommentItem}
            keyExtractor={item => {return item.id.toString()}}
        />
        </Card>
        </Animatable.View>
    );
}

class Dishdetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
          showModal: false,
          author: "",
          comment: "",
          rating: null
        };
      }

    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }

    toggleModal = () => {
        this.setState({ showModal: !this.state.showModal });
    };

    ratingCompleted = rating => {
        this.setState({ rating: rating });
    };
    
    handleAuthorInput = author => {
        this.setState({ author: author });
    };
    
    handleCommentInput = comment => {
        this.setState({ comment: comment });
    };
    
    resetForm() {
      this.setState({
        author: "",
        comment: "",
        rating: null
      });
    }
    
    handleComment() {
        const { rating, author, comment } = this.state;
        const dishId = this.props.route.params.dishId;
    
        this.toggleModal();
        this.props.postComment(dishId, rating, author, comment);
    }
    
    render() {
        const dishId = this.props.route.params.dishId;
        return(
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(el => el === dishId)}
                    onPress={() => this.markFavorite(dishId)} 
                    onPressAddComment={this.toggleModal}
                />
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.showModal}
                    onDismiss={() => this.toggleModal()}
                    onRequestClose={() => this.toggleModal()}
                >
                    <View style={styles.modal}>
                        <Rating
                        imageSize={30}
                        startingValue={5}
                        showRating
                        onFinishRating={this.ratingCompleted}
                        style={{ paddingVertical: 10 }}
                        />
                        <Input
                        placeholder="Author"
                        onChangeText={this.handleAuthorInput}
                        leftIcon={{ type: "font-awesome", name: "user-o" }}
                        />
                        <Input
                        placeholder="Comment"
                        onChangeText={this.handleCommentInput}
                        leftIcon={{ type: "font-awesome", name: "comment-o" }}
                        />
                        <View></View>
                        <View style={{ margin: 10 }}>
                        <Button
                            onPress={() => {
                            this.handleComment();
                            this.resetForm();
                            }}
                            color="#512DA8"
                            title="Submit"
                        />
                        </View>
                        <View style={{ margin: 10 }}>
                        <Button
                            onPress={() => {
                            this.toggleModal();
                            this.resetForm();
                            }}
                            color="gray"
                            title="Cancel"
                        />
                        </View>
                    </View>
                </Modal>
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
    modal: {
      justifyContent: "center",
      margin: 20
    }
  });

export default connect(mapStateToProps,mapDispatchToProps)(Dishdetail);