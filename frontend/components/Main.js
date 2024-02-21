import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { API_URL_DEL, API_URL_NOTES, API_URL_FAV } from "../Constants";
import { RefreshControl } from "react-native";
import Markdown from "react-native-markdown-display";
import { useFocusEffect } from "@react-navigation/native";
import Note from "./Note";

export default function Main({ navigation, user, signOut }) {
  const [pfp, setPfp] = useState(
    "https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg"
  );

  const [notes, setNotes] = useState([]);

  const fetchNotes = async () => {
    const response = await fetch(`${API_URL_NOTES}/${user.UserID}`);

    const data = await response.json();

    setNotes(data);
  };

  const getNoteByID = (id) => {
    const foundNote = notes.find((item) => id == item.NoteID);
    console.log(foundNote);
    if (!foundNote) return null;
    else return foundNote;
  };

  useEffect(() => {
    fetchNotes();
    setUserId(user.UserID);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchNotes();
    }, [])
  );

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setPfp(result.assets[0].uri);
    }
  };

  const handleNotePress = (id) => {
    const selectedNote = getNoteByID(id);
    if (selectedNote) {
      setIsEditOpen(true);
      setTitle(selectedNote.Title);
      setContent(selectedNote.Content);
      setId(selectedNote.NoteID);
      setIsFavorited(selectedNote.IsFav);
    } else alert("An error occured while opening the note.");
  };

  const handleAddNote = () => {
    setIsEditOpen(false);
    navigation.push("Edit", {
      title: "",
      content: "",
      isNew: true,
      userID: userId,
    });
  };

  const handleDeletePress = () => {
    Alert.alert("Are you sure?", "", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => {
          fetch(`${API_URL_DEL}/${id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
              setIsEditOpen(false);
              fetchNotes();
              return response.json();
            })
            .then((data) => {
              console.log(data);
            })
            .catch((error) => {
              console.error("Fetch error:", error);
            });
        },
      },
    ]);
  };

  const handleSearch = (text) => {
    const filtered = notes.filter((note) => {
      return (
        note.Title.toLowerCase().includes(text.toLowerCase()) ||
        note.Content.toLowerCase().includes(text.toLowerCase())
      );
    });

    setFilteredNotes(filtered);
  };

  const handleEditPress = () => {
    setIsEditOpen(false);
    navigation.push("Edit", {
      title: title,
      content: content,
      note_id: id,
      isNew: false,
    });
  };

  const handleFavoritePress = async (id, favState) => {
    try {
      await fetch(API_URL_FAV, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          NoteID: id,
          FavState: favState,
        }),
      });

      setIsFavorited(favState);

      await fetchNotes();
    } catch (error) {
      console.error("Error updating favorite:", error);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    fetchNotes()
      .then(() => {
        setRefreshing(false);
      })
      .catch((error) => {
        console.error("Error refreshing data:", error);
        setRefreshing(false);
      });
  }, []);

  const [isEditOpen, setIsEditOpen] = useState(false);

  const [title, setTitle] = useState("Title");
  const [content, setContent] = useState("Content...");
  const [id, setId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isFavorited, setIsFavorited] = useState(null);

  const [filteredNotes, setFilteredNotes] = useState([]);

  const [refreshing, setRefreshing] = useState(false);

  return (
    <>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isEditOpen}
        onRequestClose={() => {
          setIsEditOpen(!isEditOpen);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text
              style={{ fontSize: 46 }}
              numberOfLines={2}
              ellipsizeMode="tail"
              maxFontSizeMultiplier={1.5}
            >
              {title}
            </Text>
            <ScrollView>
              <Markdown style={{ body: { fontSize: 20 } }}>{content}</Markdown>
            </ScrollView>
            <View style={{ display: "flex", flexDirection: "row", gap: 20 }}>
              <Pressable
                style={{ marginTop: 20 }}
                onPress={() => setIsEditOpen(false)}
              >
                <Image
                  source={require("../images/left-arrow-alt-regular-144.png")}
                  style={{ width: 40, height: 40 }}
                  tintColor={"hsla(0, 0%, 0%, .7)"}
                />
              </Pressable>
              <Pressable
                style={{ marginTop: 20, marginLeft: "auto" }}
                onPress={() => handleFavoritePress(id, !getNoteByID(id).IsFav)}
              >
                <Image
                  source={
                    isFavorited
                      ? require("../images/star-solid-144.png")
                      : require("../images/star-regular-144.png")
                  }
                  style={{ width: 40, height: 40 }}
                  tintColor={"hsla(44, 100%, 50%, .7)"}
                />
              </Pressable>
              <Pressable style={{ marginTop: 20 }} onPress={handleEditPress}>
                <Image
                  source={require("../images/edit-solid-144.png")}
                  style={{ width: 40, height: 40 }}
                  tintColor={"hsla(0, 0%, 0%, .7)"}
                />
              </Pressable>
              <Pressable style={{ marginTop: 20 }} onPress={handleDeletePress}>
                <Image
                  source={require("../images/trash-solid-144.png")}
                  style={{ width: 40, height: 40 }}
                  tintColor={"hsla(0, 100%, 50%, 0.7)"}
                />
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.header}>
        <Pressable onPress={pickImageAsync}>
          <Image
            source={{ uri: pfp, height: 80, width: 80 }}
            borderRadius={100}
          />
        </Pressable>
        <View>
          <Text style={styles.headerText}>Welcome back,</Text>
          <Text style={styles.usernameText}>• {user.Username} •</Text>
        </View>
        <Pressable
          style={{
            height: 50,
            justifyContent: "center",
            padding: 10,
          }}
          onPress={() => signOut()}
        >
          <Image
            source={require("../images/logout.png")}
            style={{ height: 40, width: 40 }}
          />
        </Pressable>
      </View>
      <View style={styles.content}>
        <View style={styles.sectionHeader}>
          <View style={styles.line}></View>
          <Text style={styles.sectionHeaderText}>Notes</Text>
          <View style={styles.line}></View>
        </View>
        <TextInput
          placeholder="Search"
          style={{
            width: "100%",
            backgroundColor: "hsla(0, 0%, 100%, 0.8)",
            padding: 10,
            borderRadius: 10,
          }}
          onChangeText={(text) => {
            handleSearch(text);
          }}
        />
        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#000"]}
              tintColor={"#fff"}
            />
          }
        >
          <View
            style={{
              backgroundColor: "hsla(44, 100%, 50%, .2)",
              borderRadius: 10,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-evenly",
              }}
            >
              <Image
                source={require("../images/star-solid-144.png")}
                style={{ height: 30, width: 30 }}
                tintColor={"hsla(44, 100%, 50%, .7)"}
              />
              <Text style={styles.sectionHeaderText}>Favorite Notes</Text>
              <Image
                source={require("../images/star-solid-144.png")}
                style={{ height: 30, width: 30 }}
                tintColor={"hsla(44, 100%, 50%, .7)"}
              />
            </View>
            {filteredNotes !== null && filteredNotes.length > 0
              ? filteredNotes.map((item) => {
                  if (item.IsFav) {
                    return (
                      <Note
                        item={item}
                        isFav={true}
                        handleNotePress={() => handleNotePress(item.NoteID)}
                      />
                    );
                  } else {
                    return null;
                  }
                })
              : notes
                  .filter((item) => item.IsFav)
                  .map((item) => (
                    <Note
                      item={item}
                      isFav={true}
                      handleNotePress={() => handleNotePress(item.NoteID)}
                    />
                  ))}
          </View>

          <View>
            <Text style={styles.sectionHeaderText}>Other Notes</Text>
            {filteredNotes !== null && filteredNotes.length > 0
              ? filteredNotes.map(
                  (item) =>
                    !item.IsFav && (
                      <Note
                        item={item}
                        isFav={false}
                        handleNotePress={() => handleNotePress(item.NoteID)}
                      />
                    )
                )
              : notes
                  .filter((item) => !item.IsFav)
                  .map((item) => (
                    <Note
                      item={item}
                      isFav={false}
                      handleNotePress={() => handleNotePress(item.NoteID)}
                    />
                  ))}
          </View>
        </ScrollView>

        <Pressable style={styles.addNoteButton} onPress={handleAddNote}>
          <Text style={{ fontSize: 26 }}>+</Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    height: 150,
    backgroundColor: "#252525",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 40,
    paddingTop: 50,
  },
  headerText: {
    color: "#aaa",
    fontStyle: "italic",
    fontSize: 16,
    textAlign: "center",
  },
  usernameText: {
    color: "#fff",
    fontSize: 32,
    textAlign: "center",
  },
  content: {
    flex: 1,
    width: "100%",
    backgroundColor: "#252525",
    alignItems: "center",
    gap: 10,
    padding: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    gap: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#fff",
  },
  sectionHeaderText: {
    color: "#fff",
    fontSize: 32,
    textAlign: "center",
  },
  scrollView: {
    width: "100%",
  },
  note: {
    justifyContent: "center",
    padding: 10,
    width: "100%",
    height: 100,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 10,
  },
  noteTitle: {
    fontSize: 32,
  },
  noteDate: {
    fontSize: 16,
    fontStyle: "italic",
    color: "hsla(0, 0%, 0%, 0.5)",
  },
  modalContainer: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    backgroundColor: "hsla(0, 0%, 0%, .5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    height: 700,
    gap: 10,
    margin: 20,
  },
  addNoteButton: {
    position: "relative",
    width: 125,
    height: 75,
    borderRadius: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: 20,
    marginTop: 10,
  },
});
