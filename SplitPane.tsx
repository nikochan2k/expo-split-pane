import { FC, useCallback, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
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

export const SplitPane: FC<SplitPaneProps> = ({
  style,
  orientation,
  pane1,
  pane2,
  dividerSize,
}) => {
  const [state, setState] = useState<SplitState>({ clicked: false });
  const dimension = useRef(Dimensions.get("window"));
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
        setState({
          ...state,
          pane1Size: gestureState.moveY - margin,
          pane2Size: dimension.current.height - (gestureState.moveY + margin),
        });
      } else {
        setState({
          ...state,
          pane1Size: gestureState.moveX - margin,
          pane2Size: dimension.current.width - (gestureState.moveX + margin),
        });
      }
    },
    [state]
  );

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

  const pane1style: ViewStyle = { borderColor: "red", borderWidth: 1 };
  const dividerStyle: ViewStyle = {};
  const pane2style: ViewStyle = { borderColor: "red", borderWidth: 1 };
  if (orientation === "horizontal") {
    dividerStyle.height = dividerSize;
    if (state.pane1Size && state.pane2Size) {
      pane1style.height = state.pane1Size;
      pane2style.height = state.pane2Size;
    } else {
      pane1style.flex = 1;
      pane2style.flex = 1;
    }
  } else {
    dividerStyle.width = dividerSize;
    if (state.pane1Size && state.pane2Size) {
      pane1style.width = state.pane1Size;
      pane2style.width = state.pane2Size;
    } else {
      pane1style.flex = 1;
      pane2style.flex = 1;
    }
  }

  return (
    <View
      style={{
        flex: 1,
        flexDirection: orientation === "horizontal" ? "column" : "row",
        ...style,
      }}
      onLayout={(e) => {
        const layout = e.nativeEvent.layout;
        if (!state.pane1Size || !state.pane2Size) {
          const size =
            ((orientation === "horizontal" ? layout.height : layout.width) -
              dividerSize!) /
            2;
          setState({ ...state, pane1Size: size, pane2Size: size });
        }
      }}
    >
      <Animated.View style={pane1style}>{pane1}</Animated.View>
      <View
        style={{
          ...dividerStyle,
          backgroundColor: state.clicked ? "#666" : "#e2e2e2",
        }}
        {...panResponder.panHandlers}
      />
      <Animated.View style={pane2style}>{pane2}</Animated.View>
    </View>
  );
};
