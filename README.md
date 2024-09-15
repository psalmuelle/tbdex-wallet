# CHAIN WALLET

A cross-border payment platform built on Tbdex and web5

## Table of Contents

- [CHAIN WALLET](#chain-wallet)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Installation Guide](#installation-guide)
    - [Steps](#steps)
      - [Clone the repository](#clone-the-repository)
      - [Navigate to Project Folder and Install](#navigate-to-project-folder-and-install)
      - [Set up .ENV file](#set-up-env-file)
      - [Run In Development Mode](#run-in-development-mode)
      - [Setup Admin Dashboard](#setup-admin-dashboard)
      - [Restart Your App](#restart-your-app)
      - [NB](#nb)
    - [Statement of Problem](#statement-of-problem)
    - [Objectives](#objectives)
  - [Chain Wallet Technology](#chain-wallet-technology)
  - [Features](#features)
  - [Optionality](#optionality)
    - [Send Money](#send-money)
    - [Conversion](#conversion)
  - [Customer Management](#customer-management)
  - [Customer Satisfaction](#customer-satisfaction)
  - [Profitability](#profitability)

## Introduction

![Chain wallet dashboard](/public/chain-wallet-dashboard.png)

Chain wallet is a web app that utilizes the tbdex protocol and the web5 sdk to enable users to make fiat payments. Chain wallet users are able to send money to different countries, convert their funds from one currency to another, and carry out on-chain btc transactions. Chain wallet enables safe and secure delivery of funds without having to forfeit privacy and personal data. Users are in control of their identity and data on chain wallet.

## Installation Guide

To run the project in development mode, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14.x or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) as the package manager

### Steps

#### Clone the repository

```bash
   git clone https://github.com/psalmuelle/tbdex-wallet.git
```

#### Navigate to Project Folder and Install

```bash
    cd /tbdex-wallet && npm install
```

#### Set up .ENV file

Create a `.env` file and add the following to the code in the docs file below:

[Link to Doc file](https://docs.google.com/document/d/1AbIUZtwVoseelhIGFm_d3PaFH2-sSbAga_HdPDaruN8/edit?usp=sharing)

#### Run In Development Mode

```bash
    npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

#### Setup Admin Dashboard

If you would like to access the admin dashboard page, login as a normal user and copy the `Did`. Go to the `.env` file and replace the `******` in `NEXT_PUBLIC_ADMIN_DID= '********'` with your DID. Create a BTC account on the app and add the wallet address to `.env` file. You will find `NEXT_PUBLIC_ADMIN_BTC_WALLET= '********'` in the env file.

#### Restart Your App

Close the terminal and restart the app by running `npm run dev`.

#### NB

To carry out conversion on the app, you will need testnet BTC. You can get some from [https://coinfaucet.eu/en/btc-testnet/](https://coinfaucet.eu/en/btc-testnet/)

### Statement of Problem

- While some commercial banks allow cross-border payment. The process of making that happen can be slow and ambiguous, with high rate of payment failure.
- High fees and inconvenient exchange rate when sending cross border payments.
- Inability to participate in the financial system due to either distance to a physical bank or unavailabilty of solutions that enables multinatinational payments.
- Having to create accounts on different platforms just to send money. Problem can be due to the fact that one payment platform do not receive money from the other platform.

### Objectives

- To make cross-border payment fast and secure. With Chain wallet, users can make send payment to their business clients, family and friends in other countries.
- Chain wallet ensures competitive exchange rate and low fees when sending payments. With tbdex technology, customers are able to send payments with payment providers with best exchange rates and low fees.
- With Chain wallet, you can carry out transactions with multiple financial institutions facilitating exchange through the Tbdex protocol. Chain wallet allows users carry out transaction with different payment provider without having to install their mobile apps or software.

## Chain Wallet Technology

Chain wallets' core functionality is built mainly with the **Tbdex SDK**. The **Web5 SDK** is also used in the app to give users the freedom to own their data. No personal user data is stored in Chain's Web2 wallet database, except for the rating system, which helps improve decision-making for customers. And data stored in this instance are;

- rating,
- exchangeId,
- user decentralized identifier, and
- participating financial institution denctralized identifier.

Also, the web app is built with Nextjs.

## Features

The features on the Chain wallet app includes:

- Users can create balances with the PFIs (this is a feature that is not fully functional on the Tbdex protocol). Options available include the **KES**, **USD** and **EUR** accounts.
- Users can create a **BTC** for On-chain transactions. This help customers to carry out on-ramp and off-ramp transactions.
- Users can send payments to countries that support **USD**, **KES**, **EUR** and **GBP** payments or have these currencies as their national currencies.
- Users can convert from one currency to another. E.g, converting their USD to KES.
- Transfer **BTC** to other wallet addresses, i.e carry out on-chain transaction.
- Users can manage their Known Customer Credential (KCC). KCCs are stored in users' decentralized web nodes. With KCC saved in their DWN, they can use their KCC on other platforms that uses Web5 and have that KCC issuer on their app.
- A customer support system built entirely on Web5. We don't have to know your name and contact address to help resolve your payment issues. Users can reach out anonymously and get their problem fixed.
- An admin dashboard to add PFI to the app, to delete PFI, add pairs, and attend to customers issue on the app.

## Optionality

Chain wallet have a admin dashboard where app admin are able to manage PFIs. Admins can vette and participating financial institutions before adding to the platform. For scenarios where PFIs do not meet the standard of the app, admins can easily remove them from the platform. Ratings system built on the platform helps users to make informed decisions while making conversions.

### Send Money

When users are sending money, Chain wallet look for available offerings and present users with the best offering in terms of **exchange rate** and **rating**. When sending payments, most users are more concerned with the payment being delivered. Chain wallet abstract the decision layer and provide users with the best available offering.

### Conversion

When users want to convert from one currency to another, they are presented with all available offerings in with the following details:

- Financial institution name
- Financial Institution DID
- Number of Send and Conversions facilitated by the financial institution
- Their success rate in %
- Their average rating
- Estimated payout if users decide to choose the PFI
- An icon that signifies if the users meet the pfi required claims demands
- Their settlement time

With these information, users can choose which PFI they see fit to carry out their conversions.

## Customer Management

Chain wallet is built on Web5 technology. Users data including their decentralized identifiers and verifiable credentials are connected and stored on their decentralized web nodes. Users can make use of verifiable credentials they were issued on another app, provided the VC meet the requirement of an offering. They can also use the VC issued to them on Chain wallet on other platforms and apps. This provides users with easy onboarding. If a user decide not to use Chain wallet, none of their data are stored on the app, rather their decentralized web node. For an added feature, user can delete a verifiable credential, if they want to.

## Customer Satisfaction

The solution to tracking customer satisfaction is building a rating system on the app. After every transaction with a PFI (both sending and conversion), users are presented with a modal where they rate the PFI. These ratings add up for mulitple transactions and from all users on the app. With this, Chain wallet can keep track of PFIs' performance, and provide admin with better decision-making when managing the list of PFIs on the app. If lets' say, a PFI repeatedly gets a poor rating, the admin can easily deactivate it temporarily or remove totally from the app.

## Profitability

For converting from one currency to another, users are charged with a 0.85% fee when they convert from one currency to another, aside transaction fee. Since Chain wallet itself doesn't convert, the fee is deducted in BTC. Chain wallet doesnt charge any fee for sending payment cross-border. However, PFIs charge can charge conversion and send fees. Another way Chain wallet can make money (though, not implemented in this current version) is creating a Premium feature for PFIs. PFIs that subscribed to the premium feature gets to be on the list when users want to make cross border transactions, also with conversion. PFIs with the normal subscription can only be on the list of pfis for conversion.
