import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Platform,
  TextInput,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import ModalView from "./src/components/ModalView";
import PostCardItem from "./src/components/PostCardItem";

export default function App() {
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [postId, setPostId] = useState(0);
  const [loading, setLoading] = useState(false);

  const getPosts = () => {
    fetch("https://6995-14-224-144-137.ap.ngrok.io/posts")
      .then((res) => res.json())
      .then((resJson) => {
        console.log("data", resJson);
        setData(resJson);
      })
      .catch((e) => console.error(e));
  };

  const addPosts = (title, author) => {
    fetch("https://6995-14-224-144-137.ap.ngrok.io/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        title: title,
        author: author,
      }),
    })
      .then((res) => res.json())
      .then((resJson) => {
        console.log("data", resJson);
        getPosts();
      })
      .catch((e) => console.error(e));
  };

  const deletePost = (postId) => {
    fetch(`https://6995-14-224-144-137.ap.ngrok.io/posts/${postId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((resJson) => {
        console.log("delete", resJson);
        getPosts();
      })
      .catch((e) => console.error(e));
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.addPost}>
        <Text style={styles.title}>Posts</Text>
        <TouchableOpacity onPress={() => setVisible(true)}>
          <Text style={styles.btn}>Add Post</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        refreshing={loading}
        onRefresh={getPosts}
        renderItem={({ item }) => {
          <PostCardItem
            title={item.title}
            author={item.author}
            onEdit={() => edit(item.id, item.title, item.author)}
            onDelete={() => deletePost(item.id)}
          />;
        }}
      />
      <ModalView
        visible={visible}
        title="Add Post"
        onDismiss={() => setVisible(false)}
        onSubmit={() => {
          if (postId && title && author) {
            editPost(postId, title, author);
          } else {
            addPost(title, author);
          }
        }}
        cancelable
      >
        <TextInput
          label="Title"
          value={title}
          onChangeText={(text) => setTitle(text)}
          mode="outlined"
        />
        <TextInput
          label="Author"
          value={author}
          onChangeText={(text) => setAuthor(text)}
          mode="outlined"
        />
      </ModalView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    margin: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  btn: {
    backgroundColor: "#4880b5",
    borderWidth: 1,
    borderRadius: 99,
    padding: 10,
    color: "white",
  },
  showItem: {
    borderWidth: 1,
    borderColor: "black",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addPost: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
});
