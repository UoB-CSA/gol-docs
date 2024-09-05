<!--@include: index.md-->
#

## Step 5

Implement the following control rules.
Note that the running SDL provides you with a channel containing the relevant keypresses.

- If `s` is pressed, save the current state of the board as a PGM image.
    > ***NOTE:** Don't forget to send an `ImageOutputComplete` event after a PGM image is saved.*
- If `q` is pressed, stop executing Gol computation, save the current state of the board as a PGM image, then terminate the program.
    > ***NOTE:** Your distributor should behave as following after `q` is pressed:*
    > 
    > *Complete the current turn \
    > Send a `FinalTurnComplete` event \
    > Save the final state as PGM image and send an `ImageOutputComplete` event \
    > Send a `StateChange` event and terminate*
- If `p` is pressed, pause the processing and send a `StateChange` event.\
  When `p` is pressed again, resume the processing and send a `StateChange` event.
    > ***NOTE:**
    > It is **necessary** for `q` and `s` to work while the execution is paused.*

\
To test the visualisation and control rules, type the following in the terminal.

::: code-group

``` bash [Test with SDL window]
go test -v -run TestKeyboard -sdl
```

``` bash [Test without SDL window]
go test -v -run TestKeyboard
```

:::

You can also run the program and test the control rules manually by typing the following in the terminal.

``` bash
go run .
```

