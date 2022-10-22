import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { SplitPane } from "./SplitPane";

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SplitPane
        orientation="horizontal"
        pane1={
          <View style={{ flex: 1, flexGrow: 1, backgroundColor: "blue" }}>
            <Text>foo</Text>
          </View>
        }
        pane2={
          <View style={{ flex: 1, flexGrow: 1, backgroundColor: "green" }}>
            <Text>bar</Text>
          </View>
        }
      />
    </SafeAreaView>
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
