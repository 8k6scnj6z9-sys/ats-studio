# ATS Studio Reels Video Design

## Objective

Create a professional vertical promo video for Instagram Reels presenting ATS Studio as a complete digital studio for design, development, and branding.

The video should feel premium, editorial, technical, and modern, matching the current ATS Studio website language: dark background, paper/white typography, flame accent color, large expressive type, fine grid lines, technical overlays, and confident motion.

## Format

- Output: MP4
- Orientation: vertical
- Resolution: 1080x1920
- Duration: 30 seconds
- Frame rate: 30fps
- Audio direction: music-first, with animated text and no voice-over
- Main use: Instagram Reels

## Creative Direction

The reel should present ATS Studio as a complete partner for digital presence: strategy, design, web development, UI/UX, and branding.

The motion language should use:

- Large kinetic typography
- Editorial line systems and scan effects
- Simulated 3D website mockups
- Floating desktop/mobile/dashboard compositions
- Fast but readable transitions
- Flame accent highlights for emphasis

The final result should look like a premium launch trailer for a digital studio, not a screen recording.

## Storyboard

### 0-3s: Brand Opening

Show the ATS Studio wordmark or title with technical lines, subtle scan lighting, and a strong opening animation.

On-screen text:

```text
ATS Studio
```

### 3-7s: Positioning

Introduce a simulated 3D website mockup that tilts toward the camera, with moving interface panels and clean depth.

On-screen text:

```text
Design + Development + Branding
```

### 7-12s: Services

Animate service cards in a quick sequence, each using restrained motion and the ATS Studio visual system.

On-screen text:

```text
Web Design
Web Apps
UI/UX
Branding
```

### 12-18s: Digital Presence

Show a larger composition of floating mockups: desktop website, mobile layout, and dashboard/interface blocks.

On-screen text:

```text
Tudo alinhado numa presença digital clara.
```

### 18-24s: Process And Craft

Use motion graphics to show the studio process: strategy, structure, design, and code. This section should feel precise and intentional.

On-screen text:

```text
Estratégia visual. UX. Código.
```

### 24-30s: Closing CTA

Close with the ATS Studio logo/title, URL, and a direct commercial call to action.

On-screen text:

```text
Vamos criar a tua presença digital.
atstudio.pt
```

## Technical Approach

Build a local generator inside the ATS Studio project that renders the video without external paid services.

Recommended implementation:

- Create a Node-based render script in `scripts/`.
- Generate frame sequences at 1080x1920.
- Use the existing brand assets from `public/logos/` where useful.
- Use the current ATS Studio color system and messaging from the site.
- Compose frames into MP4 using the local `ffmpeg` binary.
- Generate a cover image from a strong final or mid-video frame.

Expected outputs:

```text
public/social/ats-studio-promo-vertical.mp4
public/social/ats-studio-promo-cover.png
```

## Acceptance Criteria

- The video is 1080x1920, 30fps, and approximately 30 seconds long.
- The reel contains the approved messaging and storyboard sections.
- The video visually matches the ATS Studio brand.
- Motion includes multiple animation types: typography, line graphics, transitions, and simulated 3D mockups.
- The final MP4 plays correctly locally.
- A cover PNG is generated alongside the video.

## Risks And Constraints

- The production should not depend on network access or paid video APIs.
- Real audio licensing is outside the implementation scope unless a local licensed track is provided.
- If no music file is available, the MP4 can be generated without embedded audio and the track can be added inside Instagram.
- The generator should avoid changing unrelated website files.
