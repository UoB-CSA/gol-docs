# Setup Guide

## Setup on WSL2 / Linux / macOS

### 1. Install the Rust Programming Language

To install Rust on WSL2, Linux or macOS, type the following in the terminal, then follow the on-screen instructions to install Rust.

``` bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Choose `Proceed with installation (default)`

For WSL2 / Linux: You may also need to install compiler toolchain, type

``` bash
sudo apt update
sudo apt install build-essential
```

### 2. Install SDL2 Library

Type the following in the terminal to install SDL2.

::: code-group

``` bash [WSL2]
sudo apt install libsdl2-dev
```

``` bash [Ubuntu]
sudo apt install libsdl2-dev
```

``` bash [macOS]
brew install sdl2
```

:::

::: tip For Lab machines
SDL2 should already be installed and working on school's linux lab machines.
:::

::: details Only if you don't want to use WSL2 - setup on native Windows
\
**If you are setup on WSL2, please ignore the followings.**

#### 1. Install the Rust Programming Language on native Windows

To start using Rust, download the `Rustup` - the Rust installer and version management tool, then run the program and follow the onscreen instructions.

Download RUSTUP-INIT [here](https://www.rust-lang.org/learn/get-started)

Choose `Proceed with installation (default)`

OPTIONAL: You may also need to install the [**Visual Studio C++ Build tools**](https://visualstudio.microsoft.com/visual-cpp-build-tools/) when prompted to do so.

#### 2. Install SDL2 Library on native Windows

- Download SDL development libraries [here](https://github.com/libsdl-org/SDL/releases/latest),
choose `SDL2-devel-2.x.x-VC.zip`.
- Unzip `SDL2-devel-2.x.x-VC.zip`, and copy all lib files from
    <div class="info custom-block" style="padding-top: 10px">
    SDL2-devel-2.x.x-VC\SDL2-2.x.x\lib\x64
    </div>
    to
    <div class="info custom-block" style="padding-top: 10px">
    C:\Users\{Your Username}\.rustup\toolchains\x86_64-pc-windows-msvc\lib\rustlib\x86_64-pc-windows-msvc\lib
    </div>
- Copy `SDL2.dll` from
  <div class="info custom-block" style="padding-top: 10px">
    SDL2-devel-2.x.x-VC\SDL2-2.x.x\lib\x64\
    </div>
    to the root inside the `gol-rs-skeleton` folder.
:::

## Choose an IDE / Editor

|   IDE / Editor      |
| ------------- |
| [RustRover by Jetbrains](https://www.jetbrains.com/rust/) |
| [VSCode](https://code.visualstudio.com/) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)      |
| [Fleet by Jetbrains](https://www.jetbrains.com/fleet/) |
