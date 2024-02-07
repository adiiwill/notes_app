import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import UserAuthMain from "./components/UserAuthMain";
import Login from "./components/UserAuth/Login";
import Register from "./components/UserAuth/Register";
import Main from "./components/Main";
import EditNote from "./components/EditNote";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userCheck = async () => {
      console.warn("Checking for user...");
      const usr = await AsyncStorage.getItem("user");

      if (usr) {
        const parsedUsr = await JSON.parse(usr);
        setUser(parsedUsr);
      } else {
        console.error("No user found");
      }
    };

    userCheck();
  }, []);

  useEffect(() => {
    console.log(`User changed to: ${user}`);
  }, [user]);

  const signOut = () => {
    AsyncStorage.removeItem("user");
    setUser(null);
    console.warn("User signed out!");
  };

  const signIn = (data) => {
    AsyncStorage.setItem("user", JSON.stringify(data));
    console.log(data);
    setUser(data);
    console.info("User was saved to storage!");
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen name="Main" options={{ headerShown: false }}>
              {(props) => <Main {...props} user={user} signOut={signOut} />}
            </Stack.Screen>
            <Stack.Screen
              name="Edit"
              options={{ headerShown: false }}
              component={EditNote}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Auth" options={{ headerShown: false }}>
              {(props) => <UserAuthMain {...props} signIn={signIn} />}
            </Stack.Screen>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
