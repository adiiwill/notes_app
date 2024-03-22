import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Markdown from "react-native-markdown-display";
import { API_URL_UPD, API_URL_ADD } from "../Constants";

export default function EditNote({ navigation, route }) {
  const [isPreview, setIsPreview] = useState(false);

  const [editContent, setEditContent] = useState("");
  const [editTitle, setEditTitle] = useState("");

  const [noteID, setNoteID] = useState(null);
  const [userID, setUserID] = useState(null);

  const [isNewNote, setIsNewNote] = useState(null);

  const handleTitleChange = (text) => {
    setEditTitle(text);
  };

  const handleContentChange = (text) => {
    setEditContent(text);
  };

  const handleTogglePreview = () => {
    setIsPreview(!isPreview);
  };

  const handleSavePress = async () => {
    let response = null;

    if (!isNewNote) {
      response = await fetch(`${API_URL_UPD}/${noteID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Title: editTitle,
          Content: editContent,
        }),
      });
    } else {
      response = await fetch(API_URL_ADD, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Title: editTitle,
          Content: editContent,
          UserID: userID,
        }),
      });
    }

    const responseBody = await response.json();

    if (!response.ok) {
      alert(responseBody.message);
    } else {
      alert(responseBody.message);
      navigation.goBack();
    }
  };

  const handleExit = () => {
    navigation.goBack();
  };

  useEffect(() => {
    if (route.params) {
      const { title, content, note_id, userID, isNew } = route.params;
      if (title) setEditTitle(title);
      if (content) setEditContent(content);
      if (note_id) setNoteID(note_id);
      if (userID) setUserID(userID);
      else setUserID(null);
      setIsNewNote(isNew);
    }
  }, [route.params]);

  return (
    <View style={styles.background}>
      <TextInput
        placeholder="Title"
        style={styles.title}
        placeholderTextColor={"hsla(0, 0%, 0%, 0.3)"}
        onChangeText={(text) => handleTitleChange(text)}
        value={editTitle}
      />
      {isPreview ? (
        <ScrollView>
          <Markdown style={{ body: { color: "#000", fontSize: 21 } }}>
            {editContent}
          </Markdown>
        </ScrollView>
      ) : (
        <TextInput
          placeholder="Your note starts here..."
          style={styles.content}
          placeholderTextColor={"hsla(0, 0%, 0%, 0.3)"}
          multiline
          onChangeText={(text) => handleContentChange(text)}
          value={editContent}
          textAlignVertical="top"
        />
      )}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: "auto",
          padding: 10,
          backgroundColor: "hsla(0, 0%, 0%, .7)",
          borderRadius: 25,
        }}
      >
        <Pressable onPress={handleExit}>
          <Image
            source={require("../images/left-arrow-alt-regular-144.png")}
            tintColor={"#fff"}
            style={{ width: 50, height: 50 }}
          />
        </Pressable>
        <Pressable onPress={handleTogglePreview}>
          <Image
            source={
              isPreview
                ? require("../images/eye_toggle_on.png")
                : require("../images/eye_toggle_off.png")
            }
            tintColor={"#0091f7"}
            style={{
              width: 50,
              height: 50,
              marginBottom: Platform.OS === "ios" ? 10 : 0,
            }}
          />
        </Pressable>
        <Pressable onPress={handleSavePress}>
          <Image
            source={require("../images/save-solid-144.png")}
            tintColor={"#5bda6b"}
            style={{ width: 50, height: 50 }}
          />
        </Pressable>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 50,
    flex: 1,
  },
  title: {
    fontSize: 50,
    color: "#000",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    fontSize: 21,
    color: "#000",
    flex: 1,
  },
});