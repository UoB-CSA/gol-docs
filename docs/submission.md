# Submission

The coursework requires two independent implementations - parallel and distributed.

You will be required to submit **both** implementations (assuming both were attempted).

Every student is required to upload their full work to Blackboard.

There will be three separate submissions points on Blackboard - one for the report and two for each implementation.

::: tip Note on submission

- For the report, you must submit a single file called `report.pdf`, strictly max 6 pages.

  [**Report submission point**](https://www.ole.bris.ac.uk/ultra/courses/_264159_1/outline/assessment/test/_9681467_1?courseId=_264159_1&gradeitemView=details)

- For the parallel implementation, you must submit a single zip file called `parallel.zip`. It must contain all the code required to compile and run the program. Submit a complete copy of the skeleton, **not just the `gol` folder**.

  [**Parallel submission point**](https://www.ole.bris.ac.uk/ultra/courses/_264159_1/outline/assessment/test/_9681468_1?courseId=_264159_1&gradeitemView=details)

- For the distributed implementation, you must submit a single zip file called `distributed.zip`. It must contain all the code required to compile and run the program.

  [**Distributed submission point**](https://www.ole.bris.ac.uk/ultra/courses/_264159_1/outline/assessment/test/_9681469_1?courseId=_264159_1&gradeitemView=details)

- Each zip contains **one primary implementation**, which is the version we will check for correctness. Choose the one you want to discuss primarily in the viva. It **must pass all the tests**. Any additional versions or extensions go in the `extensions.zip` file described [below](#submission-folder-structure).
:::

::: warning Please notice

- Submitting different filenames or file formats (e.g. `.docx`, `.tex`, `.7z` or `.rar`) will result in a mark penalty.
- **Each team member** has to upload an **identical copy** of the team's work.
- Make sure you submit it early (not last minute!) to avoid upload problems.
- Make sure your team member’s names and user names appear on page 1 of the report.\
**Do not include a cover page. Strictly max 6 pages.**
:::

## Submission folder structure

Your `parallel.zip` and `distributed.zip` each have the same overall shape: a complete copy of the skeleton at the **root** of the zip (not inside an extra wrapping folder), plus two nested zip files at the root: an optional `extensions.zip`, and `ai-prompts.zip`, which records the AI prompts you used.

::: code-group

```text [parallel.zip]
parallel.zip
├── check/                       ← from the skeleton (test data)
│   ├── alive/
│   │   ├── 16x16.csv
│   │   ├── 64x64.csv
│   │   └── 512x512.csv
│   └── images/
│       └── *.pgm
├── gol/                         ← YOUR primary implementation lives here
│   ├── distributor.go
│   ├── event.go
│   ├── gol.go
│   └── io.go
├── images/                      ← from the skeleton (input images)
│   └── *.pgm
├── licenses/
│   └── pgm-writer-license
├── sdl/
│   ├── loop.go
│   └── window.go
├── tests/
│   ├── alive_test.go
│   ├── gol_test.go
│   ├── keyboard_test.go
│   ├── main_test.go
│   ├── pgm_test.go
│   ├── sdl_test.go
│   ├── trace_test.go
│   └── util_test.go
├── util/
│   ├── avgturns.go
│   ├── cell.go
│   ├── check.go
│   └── visualise.go
├── .gitignore
├── ai-prompts.zip               ← AI prompts used for this part (see rules below)
├── extensions.zip               ← optional: nested zip of extra work (see rules below)
├── go.mod
├── go.sum
├── LICENSE
├── main.go
└── README.md
```

```text [distributed.zip]
distributed.zip
├── <your additional packages>/  ← e.g. the code for the Gol engine server
│   └── *.go                       (and a broker, if your design uses one)
├── check/                       ← from the skeleton (test data)
├── gol/                         ← YOUR primary implementation (local controller / client)
├── images/                      ← from the skeleton (input images)
├── licenses/
├── sdl/
├── tests/
├── util/
├── .gitignore
├── ai-prompts.zip               ← AI prompts used for this part (see rules below)
├── extensions.zip               ← optional: nested zip of extra work (see rules below)
├── go.mod
├── go.sum
├── LICENSE
├── main.go
└── README.md
```

:::

What is inside `extensions.zip` (the same layout applies to both submissions):

```text
extensions.zip
├── <your-extension-name>/       ← one sub-folder per extension is recommended
│   ├── README.txt               ← what it is, how it differs, how to run it
│   └── *.go                     ← source files only
└── <another-extension>/
    ├── README.txt
    └── *.go
```

What is inside `ai-prompts.zip` (the same layout applies to both submissions):

```text
ai-prompts.zip
├── code/                        ← prompts used to help generate code
│   └── *.txt
└── report/                      ← prompts used to help generate report material
    └── *.txt
```

The names inside the nested zips and the additional packages for the distributed version are examples; use whatever names suit your design. Everything else must keep the skeleton's names and locations.

### The primary implementation

- The code outside `extensions.zip` is your **primary submission** for that zip. It is what we will run the tests against, and it is what you should expect to discuss **primarily in the viva**.
- It must **compile and run from the root of the zip** and **pass all the tests** for that part of the coursework.
- Decide which version of your work you want to be judged on, and make that the primary one. Do not leave alternatives scattered around the root.
- **Distributed only:** your primary implementation may incorporate extensions. Anything already built into the primary implementation does not need to be repeated in `extensions.zip`.

### The `extensions.zip` file

- It is optional. If you include it, it is a **zip file called `extensions.zip`** at the **root** of the submission, in the same place as `gol/`, `images/`, `tests/` and the rest of the skeleton. It is not an unzipped folder.
- Inside it may be **only source files and `.txt` README files**:
  - source files (`.go`, including any `_test.go` files that belong to an extension);
  - plain-text READMEs with the `.txt` extension (not `.md`, `.docx` or `.pdf`).
- It must **not** contain binaries, images (`.pgm`, `.png`), profiler output, benchmark result dumps, the `out/` folder, copies of the skeleton, further nested zip files, or any other file types.
- Each extension should have a `.txt` README saying what the extension is, how it differs from the primary implementation, and how to build or run it.
- Extensions are supplementary. They must not be needed for the primary implementation to build and pass the tests.
- **Distributed only:** include in `extensions.zip` only the *additional* extensions that are not part of your primary implementation.

::: warning Zip them yourself
Because `extensions.zip` and `ai-prompts.zip` are files inside your submission, you have to create them yourself: commit the finished zip files to your repository (or add them to the final archive) so that they are included in `parallel.zip` and `distributed.zip`. Open each final zip and check that `ai-prompts.zip` (and `extensions.zip`, if you have one) is present at the root.
:::

### The `ai-prompts.zip` file

- It is a **zip file called `ai-prompts.zip`** at the **root** of the submission, in the same place as `extensions.zip`, `gol/` and the rest of the skeleton.
- It records **all of the AI prompts you used** to generate code and to generate report material.
- **Each submission contains only the prompts for its own part:**
  - `parallel.zip` contains the prompts relating to the **parallel** implementation and the parallel portions of the report;
  - `distributed.zip` contains the prompts relating to the **distributed** implementation and the distributed portions of the report.
- Inside it, keep prompts for code in a `code/` folder and prompts for report material in a `report/` folder.
- Use plain-text `.txt` files. For each prompt, record the prompt exactly as you wrote it, which AI tool you used, and what you used the response for (for example "first draft of the worker function" or "feedback on my scaling paragraph").
- AI use is **mandatory** for the parallel implementation, so `parallel.zip` must contain your recorded prompts. AI use is **permissible** for the distributed implementation: if you did not use any AI tools for it, include a single `.txt` file in the `ai-prompts.zip` in `distributed.zip` saying so.
- Record any workaround you used to get code or files into the University-provided Copilot (for example for file types it does not accept) alongside the prompts.
- It is separate from `extensions.zip`: prompts go in `ai-prompts.zip`, extra implementations go in `extensions.zip`.

You should be using `Git` for version control, however, please don't include your `.git` directory in your submission.

You can generate a correct archive by typing `git archive -o [FILENAME].zip HEAD`.
