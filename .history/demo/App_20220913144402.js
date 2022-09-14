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

// update this url -> "<new_ngrok_host_url>/posts"
const url = "https://6995-14-224-144-137.ap.ngrok.io/posts";

const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

export default function App() {
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [postId, setPostId] = useState(0);
  const [loading, setLoading] = useState(false);

  const getPosts = async () => {
    setLoading(true)
    await fetch(url)
      .then((res) => res.json())
      .then((res) => {
        setData(res);
      })
      .catch(e => console.log(e))
    setLoading(false)
  }

  const addPost = (title, author) => {
    fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        "author": author,
        "title": title,
      })
    }).then((res) => res.json())
      .then(resJson => {
        console.log('post:', resJson)
        updatePost()
      }).catch(e => { console.log(e) })
  }

  const editPost = (postId, title, author) => {
    fetch(url + `/${postId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        author: author,
        title: title,
      }),
    })
      .then((res) => res.json())
      .then((resJson) => {
        console.log("updated:", resJson);
        updatePost();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const deletePost = (postId) => {
    fetch(url + `/${postId}`, {
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

  const updatePost = () => {
    getPosts();
    setVisible(false);
    setAuthor("");
    setTitle("");
    setPostId(0);
  };

  const edit = (id, title, author) => {
    setVisible(true);
    setPostId(id);
    setTitle(title);
    setAuthor(author);
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
        keyExtractor={(item, index) => item.id + index.toString()}
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
          placeholder="Title"
          value={title}
          onChangeText={(text) => setTitle(text)}
          mode="outlined"
          style={styles.TextInputAdd}
        />
        <TextInput
          label="Author"
          value={author}
          onChangeText={(text) => setAuthor(text)}
          mode="outlined"
          style={styles.TextInputAdd}
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
  TextInputAdd: {
    borderWidth: 1,
    borderColor: "black",
  },
});
