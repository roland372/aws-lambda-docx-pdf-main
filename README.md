# aws-lambda-docx-pdf-main

Project utilizing AWS Lambda functions to populate DOCX files with provided input, then converts them to PDF files and then merge PDFs into one.

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

To run the Connector component execute the following command:

```bash
sam local start-api
```

#### Filler
To run the Filler component execute the following command:

```bash
sam local start-lambda --host 0.0.0.0 --warm-containers LAZY
```

#### Merger
To run the Merger component execute the following command:

```bash
sam local start-lambda --host 0.0.0.0 --port 3002
```

### Postman

```bash
{
    "template": {
        "templateBody": "YOUR_TEMPLATE_BODY",
        "externalLogId": "a1I7E000001DLvvUAG",
        "documents": [
            {
                "userId": "0057E000009roh2QAA",
                "transactionIds": ["1", "2"],
                "transactionId": "1",
                "parentId": "005580000037l6mAAA",
                "firstPublishLocationId": "0057E000009roh2QAA",
                "fileName": "Account Generated Document #2.pdf",
                "extension": ".pdf",
                "encrypt": null,
                "dataToFill": {
                    "NAME": "Pyramid Construction Inc.",
                    "WEBSITE": "www.pyramid.com",
                    "PHONE": "(014) 427-4427",
                    "TYPE": "Customer - Channel",
                    "INDUSTRY": "Construction",
                    "NUMBEROFEMPLOYEES": "",
                    "ANNUALREVENUE": "",
                    "DateOfCreation": "2020-04-16 10:36:00",
                    "LatinProVerb": "Veni Vidi Vici",
                    "c.TODAY": "08/02/2022",
                    "OWNERID__NAME": "John Duda",
                    "contacts": [
                        {
                            "MOBILEPHONE": "(014) 454-6364",
                            "LASTNAME": "Stumuller",
                            "FIRSTNAME": "Pat"
                        },
                        {
                            "MOBILEPHONE": "",
                            "LASTNAME": "Bond",
                            "FIRSTNAME": "John"
                        }
                    ]
                },
                "attachAsFile": true,
                "assemblyFill": false
            },
            {
                "userId": "0057E000009roh2QAA",
                "transactionIds": ["1", "2"],
                "transactionId": "2",
                "parentId": "005580000037l6mAAA",
                "firstPublishLocationId": "0057E000009roh2QAA",
                "fileName": "Account Generated Document #2.pdf",
                "extension": ".pdf",
                "encrypt": null,
                "dataToFill": {
                    "NAME": "Pyramid Construction Inc.",
                    "WEBSITE": "www.pyramid.com",
                    "PHONE": "(014) 427-4427",
                    "TYPE": "Customer - Channel",
                    "INDUSTRY": "Construction",
                    "NUMBEROFEMPLOYEES": "",
                    "ANNUALREVENUE": "",
                    "DateOfCreation": "2020-04-16 10:36:00",
                    "LatinProVerb": "Veni Vidi Vici",
                    "c.TODAY": "08/02/2022",
                    "OWNERID__NAME": "Lukasz Duda",
                    "contacts": [
                        {
                            "MOBILEPHONE": "(014) 454-6364",
                            "LASTNAME": "Stumuller",
                            "FIRSTNAME": "Pat"
                        },
                        {
                            "MOBILEPHONE": "",
                            "LASTNAME": "Bond",
                            "FIRSTNAME": "John"
                        }
                    ]
                },
                "attachAsFile": true,
                "assemblyFill": false
            }
        ]
    },
    "organizationId": "00D7Q000007aaB3UAI",
    "namespace": "ave",
    "callbackEndpoint": "https://britenet--AvenirUAT.my.salesforce.com"
}
```
