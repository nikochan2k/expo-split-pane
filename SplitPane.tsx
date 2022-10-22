import { FC, useCallback, useMemo, useRef, useState } from "react";
import {
  Animated,
  LayoutRectangle,
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
  dividerStyle?: ViewStyle;
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

const DEFAULT_DIVIDER_SIZE = 6;

export const SplitPane: FC<SplitPaneProps> = ({
  style,
  orientation,
  pane1,
  pane2,
  dividerStyle,
}) => {
  const [state, setState] = useState<SplitState>({ clicked: false });
  const layout = useRef<Layout>({});
  const layoutTimer = useRef<any>();

  if (!dividerStyle) dividerStyle = {};
  if (!dividerStyle.backgroundColor) {
    dividerStyle.backgroundColor = state.clicked ? "#666" : "#e2e2e2";
  }

  const dividerClicked = useCallback(
    (clicked: boolean) => {
      setState({ ...state, clicked });
    },
    [state]
  );

  const dividerMoved = useCallback(
    (gestureState: PanResponderGestureState) => {
      if (orientation === "horizontal") {
        const { top, height } = layout.current;
        if (top != null && height != null) {
          const margin = (dividerStyle!.height as number) / 2;
          setState({
            ...state,
            pane1Size: gestureState.moveY - margin - top,
            pane2Size: height + top - (gestureState.moveY + margin),
          });
        }
      } else {
        const { left, width } = layout.current;
        if (left != null && width != null) {
          const margin = (dividerStyle!.width as number) / 2;
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

  const measureLayout = useCallback((l: LayoutRectangle) => {
    if (layoutTimer.current) {
      clearTimeout(layoutTimer.current);
    }
    layoutTimer.current = setTimeout(() => {
      const { left, top, width, height } = layout.current;
      if (
        left !== l.x ||
        top !== l.y ||
        width !== l.width ||
        height !== l.height
      ) {
        layout.current = {
          left: l.x,
          top: l.y,
          width: l.width,
          height: l.height,
        };
      }
    }, 100);
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
  const pane2Style: ViewStyle = { borderColor: "red", borderWidth: 1 };
  if (orientation === "horizontal") {
    if (!dividerStyle.height) {
      dividerStyle.height = DEFAULT_DIVIDER_SIZE;
    }
    if (state.pane1Size && state.pane2Size) {
      pane1Style.height = state.pane1Size;
      pane2Style.height = state.pane2Size;
    } else {
      pane1Style.flex = 1;
      pane2Style.flex = 1;
    }
  } else {
    if (!dividerStyle.width) {
      dividerStyle.width = DEFAULT_DIVIDER_SIZE;
    }
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
      onLayout={(e) => measureLayout(e.nativeEvent.layout)}
    >
      <Animated.View style={pane1Style}>{pane1}</Animated.View>
      <View style={dividerStyle} {...panResponder.panHandlers} />
      <Animated.View style={pane2Style}>{pane2}</Animated.View>
    </View>
  );
};
