import { StyleSheet, Text, View } from "react-native";
import { SplitPane } from "./SplitPane";

export default function App() {
  return (
    <SplitPane
      orientation="horizontal"
      pane1={
        <View style={{ flex: 1, flexGrow: 1, backgroundColor: "blue" }}>
          <Text>hoge</Text>
        </View>
      }
      pane2={
        <View style={{ flex: 1, flexGrow: 1, backgroundColor: "green" }}>
          <Text>fuga</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
