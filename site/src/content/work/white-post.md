---
title: 'White Post: a document-delivery robot that rides the elevator'
shortTitle: White Post
kicker: Senior project · Jun 2025 – Mar 2026
summary: An autonomous courier that carries documents between floors. It drives on a custom multi-terrain base, finds the elevator panel with its own vision model, and presses the button with a 5-DOF arm.
order: 1
cover: ../../assets/work/whitepost.webp
coverAlt: White Post robot with its arm raised in a building corridor
coverStyle: photo
robot: whitepost
facts:
  - { value: '5-DOF', label: 'arm with full inverse + forward kinematics' }
  - { value: 'YOLOv8', label: 'custom model for elevator buttons and door state' }
  - { value: 'Tracked + wheel', label: 'custom multi-terrain chassis' }
  - { value: '10 months', label: 'senior project, Jun 2025 – Mar 2026' }
flow:
  title: How it uses the elevator
  steps:
    - { title: Drive, text: 'Carries the documents on a custom chassis with tracked and wheel drive for multi-terrain mobility.' }
    - { title: Find the panel, text: 'A custom YOLOv8 model, integrated with OpenCV, identifies and tracks the elevator buttons.' }
    - { title: Press the button, text: 'Inverse and forward kinematics position the 5-DOF arm to press the button precisely.' }
    - { title: Watch the door, text: 'The vision system monitors whether the elevator door is open or closed.' }
specs:
  - { label: Chassis, value: 'Custom design, tracked + wheel drive' }
  - { label: Arm, value: '5-DOF, full inverse + forward kinematics' }
  - { label: Vision, value: 'Custom YOLOv8 + OpenCV: elevator buttons, door open/closed' }
  - { label: Stack, value: 'ROS2 · Python · C++ · OpenCV' }
tags: [ROS2, YOLOv8, OpenCV, Inverse kinematics]
videos:
  - { label: Demo video 1, youtubeId: g4I4fgwufIk }
  - { label: Demo video 2, youtubeId: lchcDQzbmp4 }
github: https://github.com/EARTH157/Senior_Project-WhitePost-Main_Arm
---

## What it does

White Post delivers documents inside a building on its own, including trips that need the elevator: it finds the elevator panel, presses the button with its arm, and watches the door.

## What I built

- **Chassis.** Designed the custom robot chassis to carry the 5-DOF arm, with a combined tracked and wheel drive for multi-terrain mobility.
- **Arm control.** Developed the full control software for the 5-DOF arm, implementing inverse and forward kinematics so it can press elevator buttons precisely.
- **Vision.** Developed and deployed a custom YOLOv8 model, integrated with OpenCV, that identifies and tracks the elevator buttons and monitors whether the elevator door is open or closed.
