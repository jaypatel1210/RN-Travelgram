import React from 'react';
import {StyleSheet} from 'react-native';

import {Body, Right, Text, Button, Icon, Title, Header} from 'native-base';

import {connect} from 'react-redux';
import propTypes from 'prop-types';
import {signOut} from '../action/auth';

const CustomHeader = ({authState, signOut, navigation}) => {
  return (
    <Header
      androidStatusBarColor="#0f4c75"
      style={{backgroundColor: '#0f4c75'}}>
      <Body>
        <Title>Social App</Title>
      </Body>
      <Right>
        {authState.iaAuthenticated && (
          <>
            <Button
              transparent
              iconLeft
              onPress={() => navigation.navigate('AddPost')}>
              <Text style={{color: '#fdcb9e'}}>Add Post</Text>
            </Button>
            <Button transparent onPress={() => signOut()}>
              <Icon name="log-out-outline" style={{color: 'red'}} />
            </Button>
          </>
        )}
      </Right>
    </Header>
  );
};

CustomHeader.propTypes = {
  signOut: propTypes.func.isRequired,
  authState: propTypes.object.isRequired,
};

const mapStateToProps = state => ({
  authState: state.auth,
});

const mapDispatchToProps = {
  signOut,
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomHeader);
