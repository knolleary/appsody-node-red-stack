# Node-RED Appsody Stack

This is a stack for building a deployable Node-RED application using [Appsody](https://appsody.dev).

The resulting application will run the Node-RED flows in a headless mode without
the editor enabled.

The stack builds into the application a standard set of cloud-native endpoints
to determine `readiness` and `liveness` of the application. These are exposed as:

 - Readiness endpoint: http://localhost:3000/ready
 - Liveness endpoint: http://localhost:3000/live
 - Health check endpoint: http://localhost:3000/health

## Templates

This stack provides a single template - `simple`. It is the most minimal template
to get started.


## Getting Started

### 1. Build the stack image

In the root directory of this repository run:

```bash
sh scripts/buildStackImage.sh .
```

That will create the docker image for the stack.

### 2. Package the templates

In the root directory of this repository run:

```bash
sh scripts/packageTemplate.sh .
```

That will create a `tgz` file for each template in the stack - currently only
the one. The files are creates in the `repo` directory.

### 3. Register the stack with the appsody cli

This repository includes an `index.yaml` file that can be registered with the appsody
cli.

Before you register it, you must edit it to update the `urls` property to point
at where the template tgz file is on your local file system.

Once you have updated that, you can register the stack by running the command (with
the right url for your local file system):

```
appsody repo add local file:///Users/nol/code/knolleary/appsody-node-red-stack/repo/index.yaml
```

## Using the stack

The stack is designed to augment a Node-RED project.

A typical Node-RED project will have the structure:

```
├── README.md
├── flow.json
├── flow_cred.json
├── package.json
└-- settings.js
```

The `package.json` file will have the structure:
```
{
    "name": "AppsodyProject",
    "description": "A Node-RED Project",
    "version": "0.0.1",
    "dependencies": {},
    "node-red": {
        "settings": {
            "flowFile": "flow.json",
            "credentialsFile": "flow_cred.json"
        }
    }
}
```

This stack will use the package.json file to install any additional dependencies
the project has and also to identify the flow file - using the `node-red` section.

If the package.json file doesn't have `node-red` section, the stack will use `flow.json`
as the default flow file.


The `settings.js` file is a normal Node-RED settings file, but the stack will override
some of the values:

 - `httpAdminRoot` is set to `/admin` - this moves the editor away from `/`. In the future
   the default behaviour will be to disable the editor entirely for production environments.
 - more tbd


Given this structure, the follow steps can be used to use the stack:

1. Initialise it using the Appsody CLI:

    ```bash
    appsody init node-red
    ```

2. Once it has been initialised, you can then run the application using:

    ```bash
    appsody run
    ```

    This launches a Docker container, exposing it on port 3000.



## Next steps

This is a *very* early stage POC of a Node-RED stack. These's a tonne more work
to do to take full advantage of the appsody development process - such as live
reloading of the application.

We also need to identify what are the *right* set of default settings the stack
should be applying.
