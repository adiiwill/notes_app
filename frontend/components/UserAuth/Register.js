import { View, StyleSheet, Text, TextInput, Pressable } from "react-native";
import { API_URL_REG } from "../../Constants";
import { useState } from "react";

export default function Register({ signIn }) {
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  const handleRegister = async () => {
    try {
      const response = await fetch(API_URL_REG, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message);
      } else {
        alert("Succesful registration!");
        handleLogin();
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <>
      <View style={styles.background}>
        <View style={styles.loginForm}>
          <Text style={{ fontSize: 40 }}>Register</Text>
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
              placeholder="Email"
              onChangeText={(text) => {
                setEmail(text);
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
          <Pressable style={styles.buttonStyle} onPress={handleRegister}>
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
    height: 450,
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
