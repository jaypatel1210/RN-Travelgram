import React, {useEffect, useState} from 'react';
import {Image, Linking} from 'react-native';
import {
  Card,
  CardItem,
  Thumbnail,
  Text,
  Button,
  Icon,
  Left,
  Body,
  Right,
} from 'native-base';
import database from '@react-native-firebase/database';

const Post = ({item, userDetails}) => {
  const [upvote, setUpvote] = useState(0);
  const [downvote, setDownvote] = useState(0);

  const upVotePost = () => {
    database().ref(`/posts/${item.id}/vote/${userDetails.uid}`).set({
      upvote: 1,
    });
  };
  const downVotePost = () => {
    database().ref(`/posts/${item.id}/vote/${userDetails.uid}`).set({
      downvote: 1,
    });
  };

  useEffect(() => {
    if (item.vote) {
      let upVote1 = 0;
      let downVote1 = 0;

      Object.values(item.vote).map(val => {
        if (val.upvote) upVote1++;
        if (val.downvote) downVote1++;
      });
      setUpvote(upVote1);
      setDownvote(downVote1);
    }
  }, [item]);

  return (
    <Card
      style={{
        backgroundColor: '#0f4c75',
        borderColor: '#0f4c75',
      }}>
      <CardItem
        style={{
          backgroundColor: 'transparent',
        }}>
        <Left>
          <Thumbnail source={{uri: item.userImage}} small />
          <Body>
            <Text
              style={{
                color: '#fdcb9e',
              }}>
              {item.by}
            </Text>

            <Text note>{item.location}</Text>
          </Body>
        </Left>
      </CardItem>
      <CardItem cardBody>
        <Image
          source={{uri: item.picture}}
          style={{height: 200, width: null, flex: 1}}
        />
      </CardItem>
      <CardItem
        cardBody
        style={{
          backgroundColor: 'transparent',
        }}>
        <Text
          numberOfLines={2}
          style={{
            color: '#fff',
          }}>
          {item.description}
        </Text>
      </CardItem>

      <CardItem
        style={{
          backgroundColor: '#0f4c75',
        }}>
        <Left>
          <Button transparent onPress={upVotePost}>
            <Icon
              name="thumbs-up"
              type="Entypo"
              style={{fontSize: 20, color: '#fdcb9e'}}
            />
            <Text
              style={{
                color: '#fdcb9e',
              }}>
              {upvote}
            </Text>
          </Button>
          <Button transparent onPress={downVotePost}>
            <Icon
              name="thumbs-down"
              type="Entypo"
              style={{fontSize: 20, color: '#fdcb9e'}}
            />
            <Text
              style={{
                color: '#fdcb9e',
              }}>
              {downvote}
            </Text>
          </Button>
        </Left>
        <Right>
          <Button
            transparent
            iconLeft
            onPress={() => {
              Linking.openURL(`instagram://user?username=${item.instaId}`);
            }}>
            <Text
              style={{
                color: '#fdcb9e',
              }}>
              Open in
            </Text>
            <Icon
              name="instagram"
              type="Feather"
              style={{fontSize: 20, color: '#fdcb9e'}}
            />
          </Button>
        </Right>
      </CardItem>
    </Card>
  );
};

export default Post;
