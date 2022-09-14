import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

export default function App() {
  const [data, setData] = useEffect([]);
  const getPosts = () => {
    fetch("https://9a69-14-224-144-137.ap.ngrok.io/posts")
    .then((res) => res.json())
    .then(resJson => {
      console.log('data', resJson);
      setData(resJson);
    }).catch(e => console.error(e));
  }

  useEffect(() => {
    getPosts();
  }, [])
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <FlatList
      data={data}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) =>{
        return (
          <View>
        )
      }}
      />
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
