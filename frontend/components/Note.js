import { Pressable, Text, StyleSheet } from "react-native";

export default function Note({ item, isFav, handleNotePress }) {
  return (
    <Pressable
      style={{
        ...styles.note,
        borderColor: isFav ? "hsla(44, 100%, 50%, .7)" : "transparent",
        borderWidth: 3,
      }}
      key={item.NoteID}
      onPress={() => handleNotePress(item.NoteID)}
    >
      <Text style={styles.noteTitle} ellipsizeMode="tail" numberOfLines={1}>
        {item.Title}
      </Text>
      <Text style={styles.noteDate}>
        {new Date(item.CreationDate).toLocaleDateString()}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
});
