# expo-split-pane

Split pane for Expo, movable divider.

# Install

`npm i expo-split-pane`
or
`yarn add expo-split-pane`

# Demo

![open](https://github.com/nikochan2k/expo-split-pane/blob/6f55d25a407c5bb53735087e790db0d0c1253afd/assets/demo.gif)

# Usage

```jsx harmony
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
          <View
            style={{ flex: 1, flexGrow: 1, backgroundColor: "lightyellow" }}
          >
            <Text>center1</Text>
          </View>
        }
        pane2={
          <View style={{ flex: 1, flexGrow: 1, backgroundColor: "khaki" }}>
            <Text>center2</Text>
          </View>
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
      />
    </SafeAreaView>
  );
}
```

# Props

| prop         | type                       | required | note                    |
| ------------ | -------------------------- | -------- | ----------------------- |
| orientation  | 'horizontal' or 'virtical' | false    | default is 'horizontal' |
| style        | ViewStyle                  | false    | container style         |
| dividerStyle | ViewStyle                  | false    | divider style           |
| pane1        | JSX.Element                | true     | first element           |
| pane2        | JSX.Element                | true     | second element          |
| min          | number                     | false    | min size, default is 30 |
| flipped      | boolean                    | false    | flip pane1 and pane2    |
