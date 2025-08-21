# Microphone Speaking Indicator

This feature adds a visual indicator to show when you're speaking during a call.

## Features

- 🎤 **Real-time audio detection** - Shows when you're actively speaking
- 🔴 **Mute state indicator** - Red indicator when microphone is muted
- 📊 **Audio level visualization** - Animated bars that respond to volume
- 🟢 **Speaking animation** - Pulsing green effect when speaking
- 📱 **Responsive design** - Works on all screen sizes

## Components

### MicrophoneIndicator
Advanced indicator with real-time audio analysis:
- Uses Web Audio API to detect speaking
- Shows audio levels with animated bars
- Provides visual feedback based on microphone input volume
- Fallback behavior if audio analysis fails

### SimpleMicrophoneIndicator  
Simplified indicator for basic status:
- Shows microphone enabled/muted state
- Simple pulsing animation when active
- More reliable across different browsers
- Lightweight alternative

## Usage

The indicators are automatically added to:
- **Call Lobby** - Shows during microphone setup (large size)
- **Active Call** - Shows in the header during calls (medium size)

## Visual States

1. **Muted** - Red background with crossed-out microphone icon
2. **Silent** - Gray background when not speaking
3. **Speaking** - Green background with pulsing animation and audio level bars
4. **Active** - Green background when microphone is enabled

## Browser Compatibility

- **Chrome/Edge** - Full audio analysis support
- **Firefox** - Full audio analysis support  
- **Safari** - May fallback to simple indicator
- **Mobile browsers** - Simple indicator recommended

## Customization

You can customize the indicator size:
- `size="sm"` - Small (24x24px)
- `size="md"` - Medium (32x32px) 
- `size="lg"` - Large (40x40px)

The indicator automatically adapts its colors and animations based on the current state.
