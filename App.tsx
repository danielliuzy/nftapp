import { Button, StyleSheet, View } from "react-native";
import { dynamicClient } from "./src/client";

export default function App() {
  console.log(dynamicClient.networks.evm);
  return (
    <View style={styles.container}>
      <dynamicClient.reactNative.WebView />
      <Button title="Show modal" onPress={() => dynamicClient.ui.auth.show()} />
    </View>
  );
  // const [{ x, y, z }, setData] = useState({
  //   x: 0,
  //   y: 0,
  //   z: 0,
  // });
  // const [subscription, setSubscription] = useState<Subscription | null>(null);

  // const _slow = () => Accelerometer.setUpdateInterval(1000);
  // const _fast = () => Accelerometer.setUpdateInterval(16);

  // const _subscribe = () => {
  //   setSubscription(Accelerometer.addListener(setData));
  // };

  // const _unsubscribe = () => {
  //   subscription && subscription.remove();
  //   setSubscription(null);
  // };

  // useEffect(() => {
  //   _subscribe();
  //   return () => _unsubscribe();
  // }, []);

  // useEffect(() => {
  //   const subscription = RNShake.addListener(() => {
  //     console.log("shake!");
  //   });

  //   return () => {
  //     // Your code here...
  //     subscription.remove();
  //   };
  // }, []);

  // const [location, setLocation] = useState<Location.LocationObject | null>(
  //   null
  // );
  // const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // useEffect(() => {
  //   (async () => {
  //     let { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== "granted") {
  //       setErrorMsg("Permission to access location was denied");
  //       return;
  //     }

  //     let location = await Location.getCurrentPositionAsync({});
  //     setLocation(location);
  //   })();
  // }, []);

  // let text = "Waiting..";
  // if (errorMsg) {
  //   text = errorMsg;
  // } else if (location) {
  //   text = JSON.stringify(location);
  // }

  // return (
  //   <View style={styles.container}>
  //     <Text style={styles.text}>
  //       Accelerometer: (in gs where 1g = 9.81 m/s^2)
  //     </Text>
  //     <Text style={styles.text}>x: {x}</Text>
  //     <Text style={styles.text}>y: {y}</Text>
  //     <Text style={styles.text}>z: {z}</Text>
  //     <View style={styles.buttonContainer}>
  //       <TouchableOpacity
  //         onPress={subscription ? _unsubscribe : _subscribe}
  //         style={styles.button}
  //       >
  //         <Text>{subscription ? "On" : "Off"}</Text>
  //       </TouchableOpacity>
  //       <TouchableOpacity
  //         onPress={_slow}
  //         style={[styles.button, styles.middleButton]}
  //       >
  //         <Text>Slow</Text>
  //       </TouchableOpacity>
  //       <TouchableOpacity onPress={_fast} style={styles.button}>
  //         <Text>Fast</Text>
  //       </TouchableOpacity>
  //     </View>
  //     <Text>{text}</Text>
  //   </View>
  // );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  text: {
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "stretch",
    marginTop: 15,
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
    padding: 10,
  },
  middleButton: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#ccc",
  },
});
