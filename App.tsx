import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { SplitPane } from "./module/SplitPane";

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SplitPane
        style={{ flex: 0.3 }}
        orientation="vertical"
        pane1={
          <View
            style={{ flex: 1, flexGrow: 1, backgroundColor: "deepskyblue" }}
          >
            <Text>top1</Text>
          </View>
        }
        pane1InitialSize={100}
        pane2={
          <View style={{ flex: 1, flexGrow: 1, backgroundColor: "dodgerblue" }}>
            <Text>top2</Text>
          </View>
        }
      />
      <SplitPane
        style={{ flex: 1 }}
        orientation="horizontal"
        pane1={
          <TouchableOpacity
            style={{ flex: 1, flexGrow: 1, backgroundColor: "lightyellow" }}
          >
            <Text>center1</Text>
          </TouchableOpacity>
        }
        pane2={
          <TouchableOpacity
            style={{ flex: 1, flexGrow: 1, backgroundColor: "khaki" }}
          >
            <Text>center2</Text>
          </TouchableOpacity>
        }
      />
      <SplitPane
        style={{ flex: 0.3 }}
        orientation="vertical"
        pane1={
          <View style={{ flex: 1, flexGrow: 1, backgroundColor: "lightgreen" }}>
            <Text>bottom1</Text>
          </View>
        }
        pane2={
          <View style={{ flex: 1, flexGrow: 1, backgroundColor: "limegreen" }}>
            <Text>bottom2</Text>
          </View>
        }
        pane2InitialSize={100}
      />
    </SafeAreaView>
  );
}
