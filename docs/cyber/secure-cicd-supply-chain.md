# Secure CI/CD and Software Supply-Chain Assurance

Create a continuous integration and delivery pipeline for your Game of Life implementation. The pipeline should provide automated evidence that a submitted version has been built, tested, analysed, and packaged through an identifiable and repeatable process.

Your pipeline should run when changes are proposed or merged and should include an appropriate selection of the following controls:

- compilation and automated testing;
- race, concurrency, or static analysis;
- dependency and known-vulnerability scanning;
- checks for accidentally committed credentials or secrets;
- production of a Software Bill of Materials (SBOM);
- retention of test and scanning results;
- creation of a versioned deployment artefact;
- generation of build provenance; and
- signing and verification of release artefacts.

Define a security policy that determines which findings should:

- fail the pipeline immediately;
- prevent a change from being merged;
- prevent an artefact from being released;
- generate a warning requiring review; or
- be accepted temporarily as a documented exception.

Configure the repository workflow so that important changes are reviewed before integration. Your design should consider:

- protected branches;
- pull-request review;
- restricted workflow permissions;
- automated dependency updates; and
- secure handling of pipeline secrets.

Demonstrate the operation of the pipeline by introducing a controlled set of problems. These may include:

- a failing test;
- a concurrency error detectable by the selected tools;
- a deliberately vulnerable test dependency;
- a simulated secret in a designated test file;
- an unsigned or modified build artefact; and
- a change that attempts to bypass the expected review process.

Do not introduce real credentials or deploy intentionally vulnerable artefacts to a public or production environment.

For each scenario, record:

- whether the pipeline detects the problem;
- where the finding is reported;
- whether the configured policy permits or blocks the change or release; and
- how the issue could be remediated.

Verify that a valid signed artefact can be traced to its source revision, and that modifying the artefact causes signature or integrity verification to fail.

Measure the effect of the security checks on the engineering workflow. You may consider:

- total pipeline duration;
- time added by individual assurance stages;
- number and severity of findings;
- false-positive or unactionable findings;
- time required to diagnose and remediate a controlled issue; and
- reproducibility of artefacts across repeated builds.

In your report:

- describe the pipeline stages and the threat or failure each addresses;
- explain the repository permissions and branching strategy;
- justify the selected enforcement policy;
- provide evidence from successful and unsuccessful pipeline executions;
- trace one controlled vulnerability through discovery, triage, remediation, and verification;
- explain how provenance and signing support artefact integrity;
- discuss residual risks, including compromised dependencies, build services, or administrator accounts; and
- evaluate the balance between assurance, usability, execution time, and developer productivity.
