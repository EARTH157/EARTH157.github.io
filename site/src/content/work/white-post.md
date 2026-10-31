---
title: 'White Post: a document-delivery robot that rides the elevator'
shortTitle: White Post
kicker: Senior project · Jun 2025 – Mar 2026
summary: An autonomous courier that carries documents between floors. It drives on a custom multi-terrain base, finds the elevator panel with its own vision model, and presses the button with a 5-DOF arm.
order: 1
cover: ../../assets/work/whitepost.webp
coverAlt: White Post robot with its arm raised in a building corridor
coverStyle: photo
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

White Post delivers documents inside a building on its own, including trips that need the elevator.

## How it works

- **Chassis.** A custom robot chassis built to carry the 5-DOF arm, with a combined tracked and wheel drive for multi-terrain mobility.
- **Arm control.** Full control software for the 5-DOF arm, implementing inverse and forward kinematics so it can press elevator buttons precisely.
- **Vision.** A custom YOLOv8 model, integrated with OpenCV, identifies and tracks the elevator buttons and monitors whether the elevator door is open or closed.
