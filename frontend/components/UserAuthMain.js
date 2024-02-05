import { useState } from "react";
import Login from "./UserAuth/Login";
import Register from "./UserAuth/Register";
import { Pressable, Text } from "react-native";

export default function UserAuthMain({ signIn }) {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <>
      {isLogin ? <Login signIn={signIn} /> : <Register signIn={signIn} />}
      <Pressable
        style={{
          position: "relative",
          backgroundColor: "#fff",
          width: "100%",
          marginTop: "auto",
          marginBottom: 30,
          padding: 10,
          width: 200,
          marginLeft: "auto",
          marginRight: "auto",
          borderRadius: 10,
        }}
        onPress={() => setIsLogin(!isLogin)}
      >
        <Text style={{ textAlign: "center" }}>
          {isLogin ? "Don't have an account?" : "Already registered?"}
        </Text>
      </Pressable>
    </>
  );
}
