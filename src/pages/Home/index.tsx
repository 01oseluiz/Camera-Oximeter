import React from 'react';

import {
  StyleSheet, Text, View, TouchableOpacity,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const Home : React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text>Bora bora no App de Embarcados</Text>
      <TouchableOpacity
        style={{
          flex: 0.1,
          alignSelf: 'flex-end',
          alignItems: 'center',
        }}
        onPress={() => {
          navigation.navigate('Oximeter');
        }}
      >
        <Text style={{ fontSize: 18, marginBottom: 10, color: 'black' }}> Iniciar </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;
