import React from 'react';

import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const Home : React.FC = () => (
  <View style={styles.container}>
    <Text>Bora bora no App de Embarcados</Text>
  </View>
);

export default Home;
