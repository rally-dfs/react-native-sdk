# NOTE: This repo is currently a work in progress, things may fail or work unexpectedly while testing

# rly-network-mobile-sdk


## What is rly-network-mobile-sdk?
Rly-network-mobile-sdk is a set of libraries, tools, and open source smart contracts that streamlines blockchain integration for developers to enable frictionless user onboarding and simplify on-chain transactions.

Rly-network-mobile-sdk currently offers the following services:
* Self custodied accounts: Create on-chain user custodied accounts (wallets) on their mobile device
* Dust wallets: Programmatically push RLY tokens directly to end user accounts
* Gasless transactions: Enable gasless transactions so that your users do not have to pay for gas


## Benefits of using the rly-network-mobile-sdk

#### Developer Benefits
* Streamlined blockchain integration; create user custodied accounts and fund them with RLY tokens in two lines of code
* Relayer, smart contracts, and web3 technology maintained by RLY Network so you can focus on your application
* Freedom to configure your application to lean towards a web2 experience, web3 experience, or a mix of both
* Extensive knowledge of blockchain is not required to integrate

#### User Benefits

##### Account Module
* Engage with applications without going through the complex process of manually securing an on-chain account
* Engage with applications without trusting a third party solution to create and custody an on-chain account
* Engage with applications without having to provide personal identifiable information (app level configuration)
* Agency over their self custodied account; export or move funds to another account outside of the application

##### Network Module
* Engage with applications without having to source funds, maintain balances, sign transactions, and pay for gas fees
* Instantly initiate the first on-chain transactions with dusted tokens and gasless transactions
* Engage with applications without being having to be blockchain literate


## Installation

```sh
npm install rly-network-mobile-sdk
```

This app makes use of 3rd party react native libraries that contain native code. In order to avoid conflicts if your app already uses these same libraries they are declared as peer dependencies. This means you'll need to add them as dependencies to your own project:

```sh
npm install --save react-native-get-random-values
npm install --save react-native-keychain
```


## Basic Usage

### Account

Account is the abstraction that manages creation and storage of blockchain keys on device. On it's own this does not require any connection to the outside world and is agnostic to the network you are testing against. Using this account to interact with blockchain or web services can be done using our `Network` abstraction described below.

```js
import {
  createAccount,
  getAccount,
  getAccountPhrase,
} from 'rly-network-mobile-sdk';

// creates a new account for the user and returns public address
// accepts an override boolean that allows you to create new addres for user

const newAccount = await createAccount();

//return public address for user's account
const account = await getAccount();

//return mnemonic phrase used to generate user's account
//WARNING use with caution, the mnemonic phrase gives access to the user's account

const mnemonic = await getAccountPhrase();
```

### Network

```js

import { RlyMumbaiNetwork } from 'rly-network-mobile-sdk';

// sends 10 RLY to user's account, at which point they can transact
await RlyMumbaiNetwork.registerAccount();

// transfers 2 RLY from user's account to account = 0x
await RlyMumbaiNetwork.transfer('0x', 2);

// returns the user's current RLY balance
await RlyMumbaiNetwork.getBalance();
```

Looking to develop UI or app specific features without needing end to end testing? We 2 other network implementations ideal for development provide a fake network that does not make any external network requests.

```js
// This network is entirely in memory, basically a mock. Makes no external requests and is ideal for quick UI iteration.
import { DummyNetwork as Network } from 'rly-network-mobile-sdk';

// This network makes requests to a locally running blockchain and gas station network.
// This is a great choice if you are confident running you own end to end local environment, or want to test with your own custom contracts.
import { LocalNetwork as Network } from 'rly-network-mobile-sdk';

```

## Full Example App

Want to see a working example of an app using the SDK? We provide a basic mobile app that can be found in `/example`. This app shows how to create & store a rly account, register the new account, and transfer RLY to a new address.

To run the example do the following from the top level of this repo.

**Make Sure you have all required React Native deps installed**

[react native start guide](https://reactnative.dev/docs/environment-setup)

**Install dependencies**

`yarn install`

`yarn bootstrap`

**Start Metro**

In one terminal start Metro, the react native JS bundler

`yarn example start`

**Run App**

In another terminal run build and run the ios app, this should open the app in the ios emulator

`yarn example ios`
