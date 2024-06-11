# Setup Guide

## Setup on Native Windows

### Install the Rust Programming Language

To start using Rust, download the `Rustup` - the Rust installer and version management tool, then run the program and follow the onscreen instructions.

Download RUSTUP-INIT [here](https://www.rust-lang.org/learn/get-started)

Choose `Proceed with installation (default)`

::: tip
You may also need to install the [**Visual Studio C++ Build tools**](https://visualstudio.microsoft.com/visual-cpp-build-tools/) when prompted to do so.
:::

### Install SDL2 Library

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

## Setup on WSL2
::: warning For WSL2 users
Please refer to the [**Setup on Linux**](#setup-on-linux-macos-wsl2) instructions; setting up on WSL2 is identical to setting up on Linux.

However, it's important to note a significant performance loss impacting benchmarks and leading to a suboptimal development experience. For this coursework, we recommend using native Windows instead of WSL2.

If you opt for WSL2 development, **ensure your workspace is located within the WSL2 file system**.
:::

## Setup on Linux / macOS / WSL2

### Install the Rust Programming Language

To install Rust on Linux, macOS or WSL2, type the following in the terminal, then follow the on-screen instructions to install Rust.

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Choose `Proceed with installation (default)`

You may also need to install compiler toolchain for Linux, type

```bash
sudo apt update
sudo apt install build-essential
```

### Install SDL2 Library

Type the following in the terminal to install SDL2.

::: tip For lab machines
SDL2 should already be installed and working on school's linux lab machines
:::

::: code-group

```sh [macOS]
brew install sdl2
```

```sh [Ubuntu]
sudo apt-get install libsdl2-dev
```

```sh [WSL2]
sudo apt-get install libsdl2-dev
```

:::

::: warning For macOS users
macOS users need to export library path from homebrew, add the following line to the end of `~/.zshrc`.
(you can edit `~/.zshrc` by typing `nano ~/.zshrc` in the terminal)

<div class="info custom-block" style="padding-top: 10px">
export LIBRARY_PATH="$LIBRARY_PATH:$(brew --prefix)/lib"
</div>

then type the following in the terminal

``` bash
source ~/.zshrc
```

:::

## Choose an IDE / Editor

|   IDE / Editor      |
| ------------- |
| [RustRover by Jetbrains](https://www.jetbrains.com/rust/) |
| [VSCode](https://code.visualstudio.com/) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)      |
| [Fleet by Jetbrains](https://www.jetbrains.com/fleet/) |
