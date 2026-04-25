/**
 * Constants for LoadingScreen component
 */

// Timing
export const DEFAULT_LOADING_DURATION = 3500;
export const LOADING_COMPLETE_DELAY = 500;
export const PROGRESS_UPDATE_INTERVAL = 50;
export const START_BUTTON_DELAY = 1.5;

// Animation Durations
export const ANIMATION = {
  CONTAINER_FADE: 0.4,
  CONTAINER_EXIT: 0.8,
  TEXT_FADE_IN: 0.7,
  TEXT_DELAY_INCREMENT: 0.15,
  TEXT_INITIAL_DELAY: 0.2,
  LINE_DELAY: 0.8,
  LINE_DURATION: 0.8,
  PROGRESS_OPACITY_TRANSITION: 0.3,
  DOT_ANIMATION_DURATION: 1.8,
  DOT_DELAY_INCREMENT: 0.25,
  BOTTOM_INDICATOR_DURATION: 2.5,
  PROGRESS_BAR_TRANSITION: 0.08,
} as const;

// Scale and Transform Values
export const SCALE = {
  DOT_MIN: 1,
  DOT_MAX: 1.4,
} as const;

// Progress Thresholds
export const PROGRESS = {
  SHOW_PERCENTAGE_THRESHOLD: 98,
  HIDE_PERCENTAGE_THRESHOLD: 96,
} as const;

// Easing Functions
export const EASING = {
  SMOOTH_PROGRESS: [0.22, 1, 0.36, 1],
} as const;

// Hover Animation Values
export const HOVER = {
  Y_OFFSET: -5,
  SCALE_UP: 1.1,
  SCALE_DOWN: 0.95,
  ICON_SCALE: 1.05,
  BUTTON_SCALE: 0.92,
} as const;

// Image Offsets
export const IMAGE_OFFSETS = {
  WITH_MUSIC_Y: -19,
  WITHOUT_MUSIC_Y: -30,
} as const;

// Opacity Values
export const OPACITY = {
  MEDIA_OVERLAY_LIGHT: 0.4,
  MEDIA_OVERLAY_DARK: 0.4,
  BACKGROUND_LIGHT: 0.4,
  BACKGROUND_DARK: 0.2,
  ORB_LIGHT: 0.1,
  ORB_LIGHT_ANIMATED: 0.15,
  ORB_DARK: 0.1,
  ORB_DARK_ANIMATED: 0.15,
  BOTTOM_INDICATOR_MIN: 0.3,
  BOTTOM_INDICATOR_MAX: 0.6,
} as const;

// Animation Speeds
export const ANIMATION_SPEED = {
  ORB_BLUE_DURATION: 8,
  ORB_PURPLE_DURATION: 10,
} as const;
