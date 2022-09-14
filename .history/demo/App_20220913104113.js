import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  const getPosts = () => {
    fetch("https://7541-14-224-144-137.ap.ngrok.io/posts")
    .then((res) => res.json()).then(resJson => {
      console.log(resJson);
    }).catch(e => console.error(e));
  }

  useEffect(() => {
    getPosts();
  }, [])
  return (
    <View style={styles.container}>
      <Text>Open</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
