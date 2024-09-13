# SimpleMDE React Markdown Editor

## Overview

This project is a simple Markdown editor built with React and the SimpleMDE editor. It includes a custom toolbar with options for formatting text, including bold, italic, headers, lists, and more. The editor is styled with a custom CSS to provide a responsive and modern user interface.

## Features

- **Markdown Editing**: Edit text using Markdown syntax.
- **Custom Toolbar**: A custom toolbar with buttons for formatting (bold, italic, headers, lists, etc.).
- **Responsive Design**: The editor and toolbar are responsive, ensuring a good user experience across devices.
- **Custom Scrollbar**: Styled scrollbar for the editor with hover effects.
- **Modal Dialogs**: Support for modal dialogs, e.g., for inserting links.
- **Hidden Scrollbars**: Scrollbars on the toolbar are hidden but still allow scrolling through the content.

## Technologies Used

- **React**: A JavaScript library for building user interfaces.
- **SimpleMDE**: A simple, embeddable, and beautiful JavaScript Markdown editor.
- **CodeMirror**: A versatile text editor implemented in JavaScript for the browser.
- **CSS**: Custom styles for the editor and toolbar.
- **Marked**: A markdown parser and compiler built for speed.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js**: Make sure you have Node.js installed (preferably the latest LTS version).
- **npm**: npm is the package manager for Node.js.

## Installation

To set up the project locally, follow these steps:

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/muhammadashhadgit/MDE_Gen
    ```

2. **Navigate to the Project Directory**:
    ```bash
    cd simpleMDE
    ```

3. **Install Dependencies**:
    Due to some peer dependency issues, use the `--legacy-peer-deps` flag when installing dependencies:
    ```bash
    npm install --legacy-peer-deps
    ```

    Ensure that the following versions of `codemirror` and `simplemde` are installed:
    ```bash
    npm install codemirror@^5.65.5 simplemde@^1.11.2
    ```

## Package Information

Here’s the `package.json` file with all the necessary dependencies:

```json
{
  "name": "simplemde-react",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.17.0",
    "@testing-library/react": "^13.4.0",
    "code": "^5.2.4",
    "codemirror": "^5.65.5",
    "marked": "^14.0.0",
    "mirror": "^0.3.3",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-scripts": "5.0.1",
    "simplemde": "^1.11.2",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "devDependencies": {
    "depcheck": "^1.4.7"
  }
}
