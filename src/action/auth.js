import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

import Snackbar from 'react-native-snackbar';

export const signUp = data => async dispatch => {
  console.log(data);

  const {name, instaUserName, bio, email, password, country, image} = data;

  auth()
    .createUserWithEmailAndPassword(email, password)
    .then(res => {
      database()
        .ref(`/user/${res.user.uid}`)
        .set({
          name,
          instaUserName,
          bio,
          email,
          country,
          image,
          uid: res.user.uid,
        })
        .then(r => {
          console.log('New user Created');
          Snackbar.show({
            text: 'Account Created',
            textColor: 'white',
            backgroundColor: '#1b262c',
          });
        });
    })
    .catch(error => {
      console.log(error);
      Snackbar.show({
        text: 'Signup Failed',
        textColor: 'white',
        backgroundColor: 'red',
      });
    });
};

export const signIn = data => async dispatch => {
  const {email, password} = data;

  auth()
    .signInWithEmailAndPassword(email, password)
    .then(res => {
      Snackbar.show({
        text: 'Signin Success',
        textColor: 'white',
        backgroundColor: '#1b262c',
      });
    })
    .catch(error => {
      Snackbar.show({
        text: 'Signin Failed',
        textColor: 'white',
        backgroundColor: 'red',
      });
    });
};

export const signOut = () => async dispatch => {
  auth()
    .signOut()
    .then(res => {
      Snackbar.show({
        text: 'Signout Success',
        textColor: 'white',
        backgroundColor: '#1b262c',
      });
    })
    .catch(error => {
      Snackbar.show({
        text: 'Signout Failed',
        textColor: 'white',
        backgroundColor: 'red',
      });
    });
};
