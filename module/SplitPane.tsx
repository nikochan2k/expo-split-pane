import { FC, useCallback, useMemo, useRef, useState } from "react";
import {
  Animated,
  PanResponder,
  PanResponderGestureState,
  Platform,
  View,
  ViewStyle,
} from "react-native";
import Svg, { Path } from "react-native-svg";

interface SplitPaneProps {
  style?: ViewStyle;
  orientation?: "horizontal" | "vertical";
  pane1: JSX.Element;
  pane2: JSX.Element;
  dividerStyle?: ViewStyle;
  min?: number;
  hSplitIcon?: JSX.Element;
  vSplitIcon?: JSX.Element;
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
// from https://materialdesignicons.com/
// arrow-split-horizontal
const HSPLIT = (
  <Svg width={24} height={24}>
    <Path
      fill="gray"
      d="M8,18H11V15H2V13H22V15H13V18H16L12,22L8,18M12,2L8,6H11V9H2V11H22V9H13V6H16L12,2Z"
    />
  </Svg>
);
// arrow-split-vertical
const VSPLIT = (
  <Svg width={24} height={24}>
    <Path
      fill="gray"
      d="M18,16V13H15V22H13V2H15V11H18V8L22,12L18,16M2,12L6,16V13H9V22H11V2H9V11H6V8L2,12Z"
    />
  </Svg>
);

export const SplitPane: FC<SplitPaneProps> = ({
  style,
  orientation,
  pane1,
  pane2,
  dividerStyle,
  min,
  hSplitIcon,
  vSplitIcon,
}) => {
  const [state, setState] = useState<SplitState>({ clicked: false });
  const view = useRef<View | null>(null);
  const layout = useRef<Layout>({});

  if (!orientation) orientation = "horizontal";
  if (!dividerStyle) dividerStyle = {};
  if (!dividerStyle.backgroundColor) {
    dividerStyle.backgroundColor = state.clicked ? "gray" : "lightgray";
  }
  if (!min) min = 30;
  if (!hSplitIcon) hSplitIcon = HSPLIT;
  if (!vSplitIcon) vSplitIcon = VSPLIT;

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
        setState({ ...state, pane1Size, pane2Size });
      }
    },
    [state]
  );

  const measureLayout = useCallback(() => {
    if (!view.current) return;
    view.current.measure((x, y, w, h) => {
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

  const pane1Style: ViewStyle = {};
  const pane2Style: ViewStyle = {};
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
        ...style,
        flexDirection: orientation === "horizontal" ? "column" : "row",
      }}
      ref={(ref) => (view.current = ref)}
      onLayout={measureLayout}
    >
      <Animated.View style={pane1Style}>{pane1}</Animated.View>
      <View
        ref={(ref) => {
          if (!ref) return;
          if (Platform.OS !== "web") return;
          const element = ref as unknown as HTMLElement;
          element.style.cursor = "pointer";
        }}
        style={{
          ...dividerStyle,
          alignItems: "center",
          justifyContent: "center",
          zIndex: 777,
        }}
        {...panResponder.panHandlers}
      >
        <View
          ref={(ref) => {
            if (!ref) return;
            if (Platform.OS !== "web") return;
            const element = ref as unknown as HTMLElement;
            element.style.userSelect = "none";
          }}
          style={{ position: "absolute" }}
        >
          {orientation === "horizontal" ? hSplitIcon : vSplitIcon}
        </View>
      </View>
      <Animated.View style={pane2Style}>{pane2}</Animated.View>
    </View>
  );
};
