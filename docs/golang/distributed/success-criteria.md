<!--@include: index.md-->
#

## Success Criteria

- Pass all tests cases under `TestGol`, `TestAlive`, `TestPgm` and `TestKeyboard`. We do not expect `TestSdl` to pass unless you have implemented the SDL view as an extension.
- Output the correct PGM images.
- Ensure the keyboard control rules work as needed. Note that the `k` keypress is not tested by `TestKeyboard`, but must still be implemented.
- At minimum, the controller and the Game of Life engine should be separate components running on different machines (as per Step 2 above) and communicating.
- To fully satisfy the criteria your implementation should use multiple AWS nodes efficiently.

::: info Note on SDL
Displaying the live progress of the game using SDL is **not** necessary; considering it as an extension.
\
However, you will still need to have a blank SDL window to register the keypresses.
:::
