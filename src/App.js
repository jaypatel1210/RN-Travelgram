import React from 'react';
import {Text} from 'react-native';

import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {useDispatch, connect} from 'react-redux';

import AddPost from './screens/AddPost';
import Signin from './screens/Signin';
import Signup from './screens/Signup';
import Home from './screens/Home';
import CustomHeader from './layout/CustomHeader';
import EmptyContainer from './components/EmptyContainer';
import {requestPermission} from './utils/AskPermission';

import {IS_AUTHENTICATED, SET_USER} from './action/action.types';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import {useEffect} from 'react';

const Stack = createStackNavigator();

const App = ({authState}) => {
  const dispatch = useDispatch();

  const onAuthStateChanged = user => {
    if (user) {
      dispatch({
        type: IS_AUTHENTICATED,
        payload: true,
      });

      console.log(user);

      database()
        .ref(`/user/${user._user.uid}`)
        .on('value', snapshot => {
          if (snapshot.val()) {
            dispatch({
              type: SET_USER,
              payload: snapshot.val(),
            });
          }
        });
    } else {
      dispatch({
        type: IS_AUTHENTICATED,
        payload: false,
      });
    }
  };

  useEffect(() => {
    requestPermission();
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (authState.loading) {
    return <EmptyContainer />;
  }

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            header: props => <CustomHeader {...props} />,
          }}>
          {authState.iaAuthenticated ? (
            <>
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="AddPost" component={AddPost} />
            </>
          ) : (
            <>
              <Stack.Screen name="Signin" component={Signin} />
              <Stack.Screen name="Signup" component={Signup} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

const mapStateToProps = state => ({
  authState: state.auth,
});

export default connect(mapStateToProps)(App);
