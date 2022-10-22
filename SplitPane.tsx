import { FC, useCallback, useMemo, useRef, useState } from "react";
import {
  Animated,
  NativeMethods,
  PanResponder,
  PanResponderGestureState,
  View,
  ViewStyle,
} from "react-native";

interface SplitPaneProps {
  style?: ViewStyle;
  orientation: "horizontal" | "vertical";
  pane1: JSX.Element;
  pane2: JSX.Element;
  dividerSize?: number;
}

interface SplitState {
  pane1Size?: number;
  pane2Size?: number;
  clicked: boolean;
}

interface Layout {
  top?: number;
  left?: number;
  height?: number;
  width?: number;
}

export const SplitPane: FC<SplitPaneProps> = ({
  style,
  orientation,
  pane1,
  pane2,
  dividerSize,
}) => {
  const [state, setState] = useState<SplitState>({ clicked: false });
  const layout = useRef<Layout>({});
  if (!dividerSize) dividerSize = 6;

  const dividerClicked = useCallback(
    (clicked: boolean) => {
      setState({ ...state, clicked });
    },
    [state]
  );

  const dividerMoved = useCallback(
    (gestureState: PanResponderGestureState) => {
      const margin = dividerSize! / 2;
      if (orientation === "horizontal") {
        const { top, height } = layout.current;
        if (top != null && height != null) {
          setState({
            ...state,
            pane1Size: gestureState.moveY - margin - top,
            pane2Size: height + top - (gestureState.moveY + margin),
          });
        }
      } else {
        const { left, width } = layout.current;
        if (left != null && width != null) {
          setState({
            ...state,
            pane1Size: gestureState.moveX - margin - left,
            pane2Size: width + left - (gestureState.moveX + margin),
          });
        }
      }
    },
    [state]
  );

  const measureLayout = useCallback((target: NativeMethods) => {
    target.measure((x, y, w, h) => {
      const { left, top, width, height } = layout.current;
      if (left !== x || top !== y || width !== w || height !== h) {
        layout.current = { left: x, top: y, width: w, height: h };
      }
    });
  }, []);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponderCapture: () => true,
        onPanResponderGrant: () => dividerClicked(true),
        onPanResponderMove: (_, gestureState) => dividerMoved(gestureState),
        onPanResponderRelease: () => dividerClicked(false),
      }),
    [state]
  );

  const pane1Style: ViewStyle = { borderColor: "red", borderWidth: 1 };
  const dividerStyle: ViewStyle = {};
  const pane2Style: ViewStyle = { borderColor: "red", borderWidth: 1 };
  if (orientation === "horizontal") {
    dividerStyle.height = dividerSize;
    if (state.pane1Size && state.pane2Size) {
      pane1Style.height = state.pane1Size;
      pane2Style.height = state.pane2Size;
    } else {
      pane1Style.flex = 1;
      pane2Style.flex = 1;
    }
  } else {
    dividerStyle.width = dividerSize;
    if (state.pane1Size && state.pane2Size) {
      pane1Style.width = state.pane1Size;
      pane2Style.width = state.pane2Size;
    } else {
      pane1Style.flex = 1;
      pane2Style.flex = 1;
    }
  }

  return (
    <View
      style={{
        flex: 1,
        flexDirection: orientation === "horizontal" ? "column" : "row",
        ...style,
      }}
      onLayout={(e) => measureLayout(e.target)}
    >
      <Animated.View style={pane1Style}>{pane1}</Animated.View>
      <View
        style={{
          ...dividerStyle,
          backgroundColor: state.clicked ? "#666" : "#e2e2e2",
        }}
        {...panResponder.panHandlers}
      />
      <Animated.View style={pane2Style}>{pane2}</Animated.View>
    </View>
  );
};
