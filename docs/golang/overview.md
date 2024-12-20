# Task Overview

## Introduction

The British mathematician John Horton Conway devised a cellular automaton named ‘The Game of Life’.

The game resides on a 2-valued 2D matrix, i.e. a binary image, where the cells can either be ‘alive’ (pixel value 255 - white) or ‘dead’ (pixel value 0 - black).

The game evolution is determined by its initial state and requires no further input.

Every cell interacts with its eight neighbour pixels: cells that are horizontally, vertically, or diagonally adjacent.

At each matrix update in time the following transitions may occur to create the next evolution of the domain:

- any live cell with fewer than two live neighbours dies
- any live cell with two or three live neighbours is unaffected
- any live cell with more than three live neighbours dies
- any dead cell with exactly three live neighbours becomes alive

Consider the image to be on a closed domain
(pixels on the top row are connected to pixels at the bottom row, pixels on the right are connected to pixels on the left and vice versa).

A user can only interact with the Game of Life by creating an initial configuration and observing how it evolves.

Note that evolving such complex, deterministic systems is an important application of scientific computing, often making use of parallel architectures and concurrent programs running on large computing farms.

Your task is to design and implement programs which simulate the Game of Life on an image matrix.

## Skeleton Code

To help you along, you are given a simple skeleton project.

Starting by cloning [gol-skeleton](https://github.com/UoB-CSA/gol-skeleton) repository, you can create your own repository by `Use this template`. Remember to set your newly created repository to private and add your partner as collaborator.

The skeleton includes tests and an SDL-based visualiser.

All parts of the skeleton are commented. All the code has been written in Go.

You will not be required to write any C code. If you have any questions about the skeleton please ask a TA for help.

::: warning Please note
You **must not** modify any of the files ending in `_test.go`. We will be using these tests to judge the correctness of your implementation. We will undo any changes you make to them.
:::

::: warning For WSL2 users
If you are using WSL2, ensure your skeleton is located within the WSL2 file system. Specifically, **your project should be located at `~/.../gol-skeleton`, NOT at `/mnt/.../gol-skeleton`**
:::

The skeleton code uses SDL.
This is a basic graphics library which you already used in Imperative Programming unit.

To install the library follow the following instructions:

- **Linux Lab Machines** - SDL should already be installed and working.
- **Personal Ubuntu PCs** - `sudo apt install libsdl2-dev`
- **MacOS** - Use [Homebrew](https://brew.sh/) `brew install sdl2` or use the official [`.dmg` installer](https://www.libsdl.org/download-2.0.php).
- **Windows** - Use Ubuntu with WSL2. See our [guide](https://github.com/UoB-CSA/setup-guides/blob/master/go-install/windows.md).
- **Other** - Consult the [official documentation](https://wiki.libsdl.org/Installation).
