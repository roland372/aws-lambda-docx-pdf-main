# aws-lambda-docx-pdf-main

Project utilizing AWS Lambda functions to populate DOCX files with provided input, then converts them to PDF files and then merge PDFs into one.

# Postman input for Lambda connector

## Table of Contents

- [Components](#components)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Running the Components](#running-the-components)
    - [Connector](#connector)
    - [Filler](#filler)
    - [Merger](#merger)
  - [Postman](#postman)

## Components

### Connector

The Connector component serves as the entry point for the project. It handles incoming API requests and triggers the other components as needed.

### Filler

The Filler component is responsible for populating DOCX files with the required data. It uses AWS Lambda functions to accomplish this task.

### Merger

The Merger component focuses on converting the populated DOCX files into PDF format and then merging the resulting PDFs into a single file. Like the Filler, it also employs AWS Lambda functions for its operations.

## Getting Started

To set up and run this project locally, follow the instructions below.

### Installation

1. Clone this repository to your local machine.

2. Open a terminal and navigate to each of the component folders (`connector`, `filler`), and then navigate into the `hello-world` subfolder of each component.

3. Run the following command in each of the component's `hello-world` subfolders to install the required dependencies using npm:

   ```bash
   npm install
   ```

### Running the Components

#### Connector

To run the Connector component, navigate to the `connector/hello-world` subfolder and execute the following command:

```bash
sam local start-api
```

#### Filler
To run the Filler component, navigate to the `filler/hello-world` subfolder and execute the following command:

```bash
sam local start-lambda --host 0.0.0.0 --warm-containers LAZY
```

#### Merger
To run the Merger component, navigate to the merger/hello-world subfolder and execute the following command:

```bash
sam local start-lambda --host 0.0.0.0 --port 3002
```

### Postman

```bash
{
    "args": [
        {
            "name": "name1",
            "token": "token1",
            "inputDocxName": "input1.docx"
        },
        {
            "name": "name2",
            "token": "token2",
            "inputDocxName": "input1.docx"

        }
    ],
    "bucketName": "00bucket",
    "outputPdfName": "output1.pdf"
}
```
