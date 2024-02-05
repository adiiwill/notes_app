import { useState } from "react";
import { View, StyleSheet, Text, TextInput, Pressable } from "react-native";
import { API_URL_AUTH } from "../../Constants";

export default function Login({ signIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch(API_URL_AUTH, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message);
      }

      const responseData = await response.json();
      signIn(responseData);
    } catch (error) {
      console.error("Error during POST request:", error);
    }
  };

  return (
    <>
      <View style={styles.background}>
        <View style={styles.loginForm}>
          <Text style={{ fontSize: 40 }}>Login</Text>
          <View style={{ marginTop: 50 }}>
            <TextInput
              style={styles.inputStyle}
              placeholder="Username"
              onChangeText={(text) => {
                setUsername(text);
              }}
            />
            <TextInput
              style={styles.inputStyle}
              placeholder="Password"
              secureTextEntry={true}
              onChangeText={(text) => {
                setPassword(text);
              }}
            />
          </View>
          <Pressable style={styles.buttonStyle} onPress={handleLogin}>
            <Text style={{ fontSize: 20, textAlign: "center", color: "#fff" }}>
              →
            </Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "#080808",
  },
  loginForm: {
    display: "flex",
    backgroundColor: "#fff",
    width: 300,
    height: 400,
    borderRadius: 10,
    flexDirection: "column",
    padding: 20,
  },
  inputStyle: {
    borderColor: "#000",
    borderWidth: 3,
    marginBottom: 20,
    padding: 12,
    fontSize: 20,
    borderRadius: 10,
  },
  buttonStyle: {
    backgroundColor: "#080808",
    marginTop: "auto",
    padding: 10,
    borderRadius: 10,
  },
});
