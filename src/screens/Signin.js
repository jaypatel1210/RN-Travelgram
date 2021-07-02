import React, {useState} from 'react';
import {StyleSheet, ScrollView, Image, TouchableOpacity} from 'react-native';
import {Container, Form, Item, Input, Text, Button, H3} from 'native-base';
import Welcome from '../assets/traffic-sign.png';

import auth from '@react-native-firebase/auth';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';

import {connect} from 'react-redux';
import {signIn} from '../action/auth';
import propTypes from 'prop-types';

GoogleSignin.configure({
  webClientId:
    '840369270360-7c33m5clnalhfht7pd96547efca2opqm.apps.googleusercontent.com',
});

const Signin = ({navigation, signIn}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userInfo, setUserInfo] = useState(null);

  const doSignIn = () => {
    signIn({email, password});
  };

  const onGoogleButtonPress = async () => {
    try {
      // Get the users ID token
      const {idToken} = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      const u = await auth().signInWithCredential(googleCredential);
      console.log(await u.user);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container style={styles.container}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <H3 style={styles.heading}>Welcome to the Travel-gram Social App</H3>

        <Image
          source={Welcome}
          style={{width: null, height: 150, marginTop: 30}}
          resizeMode="contain"
        />

        <Form>
          <Item rounded style={styles.formItem}>
            <Input
              placeholder="enter your registerd email"
              value={email}
              style={{color: '#eee'}}
              onChangeText={text => setEmail(text)}
            />
          </Item>
          <Item rounded style={styles.formItem}>
            <Input
              placeholder="enter your registerd password"
              value={password}
              secureTextEntry={true}
              style={{color: '#eee'}}
              onChangeText={text => setPassword(text)}
            />
          </Item>
          <Button rounded block onPress={doSignIn}>
            <Text>SignIn</Text>
          </Button>
          <TouchableOpacity
            onPress={() => navigation.navigate('Signup')}
            style={{marginTop: 10}}>
            <Text style={{color: '#fff', textAlign: 'center'}}>
              Do not have an account, SignUp here
            </Text>
          </TouchableOpacity>
          <GoogleSigninButton
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={onGoogleButtonPress}
          />
        </Form>
      </ScrollView>
    </Container>
  );
};

Signin.propTypes = {
  signIn: propTypes.func.isRequired,
};

const mapDispatchToProps = {
  signIn: data => signIn(data),
};

export default connect(null, mapDispatchToProps)(Signin);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1b262c',
    flex: 1,
    justifyContent: 'flex-start',
  },
  heading: {
    textAlign: 'center',
    color: '#fdcb9e',
    marginHorizontal: 5,
    marginTop: 30,
  },
  formItem: {
    marginBottom: 20,
  },
});
