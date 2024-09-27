# Before you start

We will provide a **new skeleton** for distributed implementation using [Tonic](https://github.com/hyperium/tonic), a Rust implementation of [gRPC](https://grpc.io/).
gRPC is a high-performance, open-source universal RPC framework.

## 1. Setup Protocol Buffers

[Protocol Buffers](https://protobuf.dev/overview/) (protobuf) are a language-neutral, platform-neutral extensible mechanism for serialising structured data.

gPRC uses protobuf to (de)serialise structured data.

To install protobuf, type

::: code-group

```bash [WSL2]
sudo apt install protobuf-compiler
```

```bash [Ubuntu]
sudo apt install protobuf-compiler
```

```bash [macOS]
brew install protobuf
```

:::

::: details Only if you are using native Windows rather than WSL2
download `protoc-xxx-win64.zip` [here](https://github.com/protocolbuffers/protobuf/releases/latest)
(xxx represents the version)\
Unzip and put it somewhere like `C:\Program Files\protoc-xxx-win64`\
Add `C:\Program Files\protoc-xxx-win64\bin` to your **path** environment variables
:::

To check if protobuf compiler is working, type

```bash
protoc --version
```

## 2. Tonic (gRPC) hello world example

We recommend that you go through the [hello world tutorial](https://github.com/hyperium/tonic/blob/master/examples/helloworld-tutorial.md) provided by Tonic.

You can skip this example if you are already familiar with Tonic or gRPC.

## 3. Download the skeleton

Download the distributed skeleton for the coursework [here](https://github.com/UoB-CSA/gol-rs-skeleton/tree/distributed). **(the distributed branch, not the master branch)**

::: tip Make sure you are cloning or downloading the `distributed` branch!
If you are using `git clone`, switch to the `distributed` branch by typing `git switch distributed`\
If you are using `Use this template`, please check `Include all branches` and switch to the `distributed` branch as well.
:::

::: tip For WSL2 users
If you are using WSL2, ensure your skeleton is located within the WSL2 file system. Specifically, **your project should be located at `~/.../gol-rs-skeleton`, NOT at `/mnt/.../gol-rs-skeleton`**
:::

Open the skeleton with your IDE, the file structure should look like the following. If it doesn't, please make sure you have switched to the `distributed` branch!

``` text
gol-rs-skeleton/ (the folder opened by IDE)
├── controller/
│   ├── benches/
│   ├── check/
│   ├── images/
│   ├── src/
│   ├── tests/
│   ├── build.rs
│   └── Cargo.toml
├── proto/
│   └── stub.proto
├── server/
│   ├── src/
│   ├── build.rs
│   └── Cargo.toml
├── .gitignore
├── Cargo.toml
└── README.md
```

Open a terminal, cd to the `server` folder and start the server by typing

``` bash
cd server
cargo run --release
```

Open another terminal, cd to the `controller` folder, and start the controller by typing

``` bash
cd controller
cargo run --release
```

You will see the server print something like this:

```text
$ cargo run --release
[gol_server] request: World { width: 3, height: 3, cell_values: [255, 255, 255, 0, 0, 0, 255, 255, 255] }
```

And the controller will print something like this:

```text
$ cargo run --release
[gol_rs::gol::distributor] response: AliveCellsCount { cells_count: 6 }
```

## 4. Explain the skeleton with gRPC examples

### Controller (a.k.a. client) side

Open `controller/src/gol/distributor.rs`, you may find it similar to the parallel version, except we've made `remote_distributor()` an async function.

In `example_rpc_call()`,
you will see that we first convert a 2D world `Vec<Vec<CellValue>>` to bytes `Vec<u8>`.

``` rust
let bytes = world.iter().flat_map(|row| row.as_bytes()).copied().collect();
```

Then we push the "world" (bytes) to the server using an RPC call and wait (blocking) for the result to return from the server.

``` rust
// Push the world to the server and receive the response (number of alive cells) by RPC call
// the RPC call `push_world()` is defined in `proto/stub.proto`
let response = client.push_world(
    tonic::Request::new(World {
        width: 3,
        height: 3,
        cell_values: bytes,
    })
).await;
```

We handle the response by pattern matching, and print out the result (calculation of the number of alive cells) from the server.\
Note that we also assert the correctness of the calculation performed by the server.

``` rust
match response {
    Ok(response) => {
        let msg = response.into_inner();
        info!("response: {:?}", msg);
        assert_eq!(
            msg.cells_count as usize,
            world.iter().flatten().filter(|cell| cell.is_alive()).count()
        );
    },
    Err(e) => log::error!("Server error: {}", e),
}
```

Finally, we make another RPC call to notify the server (broker) to shutdown.

``` rust
// Another example of closing the server by RPC call
client.shutdown_broker(tonic::Request::new(Empty { })).await?;
```

### Server (a.k.a. broker) side

Open `server/src/main.rs`, where you will find the functions we invoked from controller within the ControllerHandler.

In `shutdown_broker()`, we shutdown the server by sending a signal to the `shutdown_tx` channel, which is ultimately handled on line 42.

``` rust
Server::builder()
    .add_service(ControllerHandlerServer::new(Arc::clone(&broker)))
    .serve_with_shutdown(addr, async { shutdown_rx.recv().await.unwrap() })// [!code highlight]
    .await?;
```

In `push_world()`, we extract the data from the request and save the `width` and `height` by read-write locks.

``` rust
async fn push_world(&self, request: Request<World>) -> Result<Response<AliveCellsCount>, Status> {
    let world = request.into_inner(); // [!code highlight]
    info!("request: {:?}", world);
    *self.width.write().await = world.width; // [!code highlight]
    *self.height.write().await = world.height; // [!code highlight]
    ...
}
```

We also convert the bytes `Vec<u8>` to a 2D world `Vec<Vec<CellValue>>` and save it accordingly.

``` rust
*self.cell_values.write().await = world.cell_values
    .chunks(world.width as usize)
    .map(|row| row.iter().copied().map(CellValue::from).collect())
    .collect();

```

You can notice `width`, `height` and `cell_values` are wrapped with `RwLock` (read-write lock).

``` rust
pub struct Broker {
    shutdown_tx: UnboundedSender<()>,
    width: RwLock<u32>, // [!code highlight]
    height: RwLock<u32>, // [!code highlight]
    cell_values: RwLock<Vec<Vec<CellValue>>>, // [!code highlight]
}
```

Finally, we count the number of alive cells and return the result to the controller as a response.

``` rust
let alive_count = self.cell_values.read().await.iter()
    .flatten().filter(|cell| cell.is_alive()).count();
// Return number of alive cells as response
Ok(Response::new(AliveCellsCount{ cells_count: alive_count as u32 }))
```

### Stub.proto

Open the `proto/stub.proto`, where you will find the definition of the "Interface" for communication between the client and the server.

## 5. Add all together

You are free to modify (and remove the examples above) from the skeleton; however, please keep the tests under `controller/tests/**.rs`, you will use them for testing your distributed implementation.

Since gRPC is a language-neutral, platform-neutral RPC framework,
you can implement different distributed components in various languages.
This can also be treated as an extension.

For example, you could use Rust to write the server (broker or workers), while keeping the controller in Golang, or even try other languages.

* Controller (Golang) <==gRPC==> Broker/Server (Rust) <==gRPC==> Workers (Rust)

Note that the protocols are different between native Golang RPC (which you learnt in previous labs) and the gRPC; do not mix them up.

If you decided to use this mixture pattern, you should use **gRPC in Golang** as well, here's an [example](https://grpc.io/docs/languages/go/quickstart/).
