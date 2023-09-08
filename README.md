# Darlington School Grade Notifier

![notification image](https://raw.githubusercontent.com/shlushi/DarlingtonGradeNotifier/master/.github/notification.png)

## Overview

This repository contains a TypeScript application that periodically checks the [Darlington School website](https://darlingtonschool.org) for updated grades and notifies users through SMS using the Telnyx API. This application helps students stay informed about new grade changes without the need to frequently check the student records page as there is no option to opt-in for this, even through email.

## Prerequisites

Before you can use this application, ensure you have the following:

- Node.js installed on your system.
- A Telnyx account with API credentials and a number.
- Access to the Darlington School student page.

## Installation

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/your-username/darlingtongradenotifier.git
   ```

2. Change to the project directory:

   ```bash
   cd darlingtongradenotifier
   ```

3. Install the required npm packages:

   ```bash
   npm install
   ```

## Configuration

1. Rename the `example.env` to `.env` in the project directory.
2. Configure the file with the following data:
   - `DAR_USER`: Your Darlington login username/email
   - `DAR_PASSWORD`: Your Darlington login password
   - `TELNYX_API_KEY`: Telnyx API v2 key which you can find [here](https://portal.telnyx.com/#/app/api-keys)
   - `FROM_PHONE_NUMBER`: A phone number ordered on Telnyx
   - `TO_PHONE_NUMBER`: The phone number to recieve SMS notifications on

## Usage

To compile and run the application, use the following command:

```bash
npm start
```

The application will periodically reload the Darlington School website, check for updated grades, and send an SMS notification if any changes are detected.

## Contributing

Contributions to this project are welcome. If you find any issues or have improvements to suggest, please open an issue or create a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgments

- [Telnyx](https://telnyx.com) for providing the SMS API.
- [puppeteer](https://github.com/puppeteer/puppeteer) for web scraping capabilities.
- [Axios](https://github.com/axios/axios) for making HTTP requests to Telnyx.
- [dotenv](https://github.com/motdotla/dotenv) for managing environment variables.
