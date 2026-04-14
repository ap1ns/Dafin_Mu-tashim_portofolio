// Comparing the three video overlays:

// YouTube - HAS pointer-events-none ✓
<div className="absolute inset-0 bg-transparent cursor-default pointer-events-none" />

// TikTok - HAS pointer-events-none ✓
<div className="absolute inset-0 bg-transparent cursor-default pointer-events-none" />

// Instagram - MISSING pointer-events-none ✗
<div className="absolute inset-0 bg-transparent cursor-default" />

// Problem: The Instagram overlay blocks pointer events, which prevents:
// 1. "View Details" button from being clickable
// 2. Or causes inconsistent click behavior that interferes with audio context

// Solution: Add pointer-events-none to Instagram overlay
