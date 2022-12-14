import { FC, useCallback, useMemo, useRef, useState } from "react";
import {
  Animated,
  PanResponder,
  PanResponderGestureState,
  Platform,
  View,
  ViewStyle,
} from "react-native";

interface SplitPaneProps {
  style?: ViewStyle;
  orientation?: "horizontal" | "vertical";
  pane1: JSX.Element;
  pane2: JSX.Element;
  pane1InitialSize?: number;
  pane2InitialSize?: number;
  dividerStyle?: ViewStyle;
  min?: number;
  flipped?: boolean;
  onChange?: (state: SplitState) => void;
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

const DEFAULT_DIVIDER_SIZE = 8;

export const SplitPane: FC<SplitPaneProps> = ({
  style,
  orientation,
  pane1,
  pane2,
  pane1InitialSize,
  pane2InitialSize,
  dividerStyle,
  min,
  flipped,
  onChange,
}: SplitPaneProps) => {
  const [state, setState] = useState<SplitState>({
    clicked: false,
    pane1Size: pane1InitialSize,
    pane2Size: pane2InitialSize,
  });
  const view = useRef<View | null>(null);
  const layout = useRef<Layout>({});
  const changeThrottleTimer = useRef<any>();

  if (!orientation) orientation = "horizontal";
  if (!dividerStyle) dividerStyle = {};
  if (!dividerStyle.backgroundColor) {
    dividerStyle.backgroundColor = state.clicked ? "gray" : "lightgray";
  }
  if (!min) min = 30;

  const dividerClicked = useCallback(
    (clicked: boolean) => {
      setState({ ...state, clicked });
    },
    [state]
  );

  const dividerMoved = useCallback(
    (gestureState: PanResponderGestureState) => {
      let pane1Size: number | undefined;
      let pane2Size: number | undefined;
      if (orientation === "horizontal") {
        const { top, height } = layout.current;
        if (top != null && height != null) {
          const margin = (dividerStyle!.height as number) / 2;
          pane1Size = gestureState.moveY - margin - top;
          pane2Size = height + top - (gestureState.moveY + margin);
        }
      } else {
        const { left, width } = layout.current;
        if (left != null && width != null) {
          const margin = (dividerStyle!.width as number) / 2;
          pane1Size = gestureState.moveX - margin - left;
          pane2Size = width + left - (gestureState.moveX + margin);
        }
      }
      if (pane1Size && pane2Size) {
        if (pane1Size < min!) {
          const diff = min! - pane1Size;
          pane1Size = min!;
          pane2Size -= diff;
        }
        if (pane2Size < min!) {
          const diff = min! - pane2Size;
          pane2Size = min!;
          pane1Size -= diff;
        }
        const spliteState: SplitState = {
          clicked: state.clicked,
          pane1Size,
          pane2Size,
        };
        setState(spliteState);

        if (onChange) {
          if (changeThrottleTimer.current != null) {
            clearTimeout(changeThrottleTimer.current);
            changeThrottleTimer.current = undefined;
          }
          changeThrottleTimer.current = setTimeout(() => {
            changeThrottleTimer.current = undefined;
            onChange(spliteState);
          }, 500);
        }
      }
    },
    [state]
  );

  const measureLayout = useCallback(() => {
    if (!view.current) return;
    view.current.measure((_x, _y, w, h, px, py) => {
      const { left, top, width, height } = layout.current;
      if (left !== px || top !== py || width !== w || height !== h) {
        layout.current = { left: px, top: py, width: w, height: h };
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

  const pane1Style: ViewStyle = {};
  const knobStyle: ViewStyle = {};
  const pane2Style: ViewStyle = {};
  if (orientation === "horizontal") {
    if (!dividerStyle.height) {
      dividerStyle.height = DEFAULT_DIVIDER_SIZE;
    }
    if (0 < (state.pane1Size ?? 0)) {
      pane1Style.height = state.pane1Size;
    } else {
      pane1Style.flex = 1;
    }
    if (0 < (state.pane2Size ?? 0)) {
      pane2Style.height = state.pane2Size;
    } else {
      pane2Style.flex = 1;
    }
    knobStyle.borderTopColor = "black";
    knobStyle.borderTopWidth = 1;
    knobStyle.borderBottomColor = "black";
    knobStyle.borderBottomWidth = 1;
    knobStyle.width = 36;
    knobStyle.height = (dividerStyle.height as number) - 4;
  } else {
    if (!dividerStyle.width) {
      dividerStyle.width = DEFAULT_DIVIDER_SIZE;
    }
    if (0 < (state.pane1Size ?? 0)) {
      pane1Style.width = state.pane1Size;
    } else {
      pane1Style.flex = 1;
    }
    if (0 < (state.pane2Size ?? 0)) {
      pane2Style.width = state.pane2Size;
    } else {
      pane2Style.flex = 1;
    }
    knobStyle.borderLeftColor = "black";
    knobStyle.borderLeftWidth = 1;
    knobStyle.borderRightColor = "black";
    knobStyle.borderRightWidth = 1;
    knobStyle.height = 36;
    knobStyle.width = (dividerStyle.width as number) - 4;
  }

  if (Platform.OS === "web" && view.current) {
    const div = view.current as unknown as HTMLDivElement;
    div.style.userSelect = state.clicked ? "none" : "auto";
  }

  return (
    <View
      style={{
        flex: 1,
        ...style,
        flexDirection: orientation === "horizontal" ? "column" : "row",
      }}
      ref={(ref) => (view.current = ref)}
      onLayout={measureLayout}
    >
      <Animated.View style={flipped ? pane2Style : pane1Style}>
        {flipped ? pane2 : pane1}
      </Animated.View>
      <View
        ref={(ref) => {
          if (!ref) return;
          if (Platform.OS !== "web") return;
          const element = ref as unknown as HTMLElement;
          element.style.cursor = "pointer";
          element.onclick = () => {}; // magic
        }}
        style={{
          ...dividerStyle,
          alignItems: "center",
          justifyContent: "center",
        }}
        {...panResponder.panHandlers}
      >
        <View style={knobStyle} />
      </View>
      <Animated.View style={flipped ? pane1Style : pane2Style}>
        {flipped ? pane1 : pane2}
      </Animated.View>
    </View>
  );
};
