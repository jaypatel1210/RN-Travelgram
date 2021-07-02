import React, {useEffect, useState} from 'react';
import {StyleSheet, ScrollView, Image} from 'react-native';
import {
  Container,
  Content,
  Form,
  Item,
  Input,
  Text,
  Button,
  H3,
  Textarea,
  Icon,
} from 'native-base';

import Snackbar from 'react-native-snackbar';
import ProgressBar from 'react-native-progress/Bar';

import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import ImagePicker from 'react-native-image-picker';
import {options} from '../utils/options';
import shortid from 'shortid';

import {connect} from 'react-redux';
import propTypes from 'prop-types';

const AddPost = ({navigation, userState}) => {
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  const [imageUploading, setImageUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  const chooseImage = async () => {
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        uploadImage(response);
      }
    });
  };

  const uploadImage = async response => {
    setImageUploading(true);

    const reference = storage().ref(response.fileName);

    const task = reference.putFile(response.path);
    task.on('state_changed', taskSnapshot => {
      const percentage =
        (taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 1000;
      setUploadStatus(percentage);
    });
    task.then(async () => {
      const url = await reference.getDownloadURL();
      setImage(url);
      setImageUploading(false);
    });
  };

  const addPost = async () => {
    try {
      if (!location || !description || !image)
        return Snackbar.show({
          text: 'All Field are Required',
          textColor: 'white',
          backgroundColor: 'yellow',
        });

      const uid = shortid.generate();
      await database()
        .ref(`/posts/${uid}`)
        .set({
          location,
          description,
          picture: image,
          by: userState.name,
          date: Date.now(),
          instaId: userState.instaUserName,
          userImage: userState.image,
          id: uid,
        })
        .then(res => {
          Snackbar.show({
            text: 'Post Added Successfully',
            textColor: 'white',
            backgroundColor: 'green',
          });
          navigation.navigate('Home');
        })
        .catch(err => {
          Snackbar.show({
            text: 'Post Upload Failed',
            textColor: 'black',
            backgroundColor: 'yellow',
          });
        });
    } catch (error) {
      console.log(error);
      Snackbar.show({
        text: 'Post Upload Failed',
        textColor: 'black',
        backgroundColor: 'yellow',
      });
    }
  };

  return (
    <Container style={styles.container}>
      <Content padder>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          {image && (
            <Image
              source={{uri: image}}
              style={styles.image}
              resizeMode="center"
            />
          )}
          <Form>
            <Item regular style={styles.formItem}>
              <Input
                placeholder="location"
                value={location}
                style={{color: '#eee'}}
                onChangeText={text => setLocation(text)}
              />
            </Item>

            {imageUploading ? (
              <ProgressBar progress={uploadStatus} style={styles.progress} />
            ) : (
              <Button
                regular
                bordered
                block
                iconLeft
                info
                style={styles.formItem}
                onPress={chooseImage}>
                <Icon
                  name="md-image-outline"
                  type="Ionicons"
                  style={styles.icon}
                />
                <Text
                  style={{
                    color: '#fdcb9e',
                  }}>
                  Choose Image
                </Text>
              </Button>
            )}

            <Item regular style={styles.formItem}>
              <Textarea
                rowSpan={5}
                placeholder="Some description..."
                value={description}
                style={{color: '#eee'}}
                onChangeText={text => setDescription(text)}
              />
            </Item>

            <Button regular block onPress={addPost}>
              <Text>Add Post</Text>
            </Button>
          </Form>
        </ScrollView>
      </Content>
    </Container>
  );
};

AddPost.propTypes = {
  userState: propTypes.object.isRequired,
};

const mapStateToProps = state => ({
  userState: state.auth.user,
});

export default connect(mapStateToProps)(AddPost);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1b262c',
    flex: 1,
    justifyContent: 'flex-start',
  },
  formItem: {
    marginBottom: 20,
  },
  icon: {fontSize: 20, color: '#fdcb9e'},
  image: {width: null, height: 150, marginVertical: 15},
  progress: {width: null, marginBottom: 20},
});
