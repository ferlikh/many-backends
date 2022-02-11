<div id="top"></div>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/ferlikh/many_backends">
    <!-- <img src="images/logo.png" alt="Logo" width="80" height="80"> -->
  </a>

<h1 align="center">Many Backends</h1>

  <p align="center">
    An educational project to familiarize oneself with any programming language by developing a generic backend server with modular features.
    <br />
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#languages-frameworks">Languages/Frameworks</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#environment-variables">Environment Variables</a></li>
        <li><a href="#database">Database</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

There's no better way to learn than by doing. The goal of this project is to explore the trade-offs between different languages when it comes to developing scalable backend REST APIs. The scope will target all relevant aspects of the software engineering life cycle, including but not limited to: architecting, building, deploying, packaging, testing, & of course, writing code. The aspiration is to build a (simple) backend system that supports a robust, extensible, and configurable generic feature set- in as many languages and frameworks as possible.

<p align="right">(<a href="#top">back to top</a>)</p>



## Languages/Frameworks

Javascript
* [Express](https://expressjs.com/)

Python
* [Flask](https://flask.palletsprojects.com/en/2.0.x/)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

This project is meant to have everything you need to run a dev instance locally, "out of the box". Here are the steps to set up the dev environment:
<br /><br />

### Environment Variables

Run one of the following based on your OS to configure the shell environment:

Linux/Mac:
* bash
  ```sh
  source ./setup.sh
  ```

Windows:
* powershell
  ```sh
  .\setup.ps1
  ```
* cmd
  ```sh
  .\setup.bat
  ```

Each backend will have it's own bootstrap process, which ends with running this command.
For brevity, commands with variables will use GNU/UNIX notation, i.e. `$VAR`- so just replace with your preferred shell's syntax.

### Database

We're using PostgreSQL, both to support open source and also because it's very feature-rich database, especially for our needs. This setup requires a local PostgreSQL installation, but it's easy enough to edit the DB variables in `.env` and run the database on a remote machine. Also update the db scripts if using those. Navigate to `src/database` and run the following:

* Connect to psql:
  ```
  psql -U $DB_USER -h $DB_HOST
  ```
* Create the database:
  ```
  \i create.sql
  ```
* Seed the database:
  ```
  \i seed.sql
  ```

Plan is to move data setup and operations like these into the backends eventually.


<p align="right">(<a href="#top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

Every project should have a `README.md` with instruction on how to run and (hopefully) test it.
<!-- The design should be PLAIN: _Pure, Lazy, Anchored, Improvable, Nothing else_ -->
<p align="right">(<a href="#top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap
Features will be marked off once they are available in two or more languages.

### Version 0 (BULLETIN)
- [X] CRUD operations on the posts table
  - [X] A thread that lists all posts
  - [X] A form to submit new posts
  - [X] A button to delete posts
- [X] Generic API schema
  - [X] Define generic routes on the module
  - [X] Design a regular pattern that can be repeated across frameworks
- [X] API tests
  - [X] Create (POST) test
  - [X] Read (GET) test
  - [X] Update (PUT) test
  - [X] Delete (DELETE) test
<!--
- [ ] Packaging
    - [X] Design a modular, composable (YAML-based) schema that can be used to define versions of the API
    - [ ] Write code to generate this schema file via reflection
- [ ] Database
  - [ ] Implement a strategy for code-first data migrations
-->

See the [open issues](https://github.com/ferlikh/many_backends/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#top">back to top</a>)</p>