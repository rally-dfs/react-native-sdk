import * as React from 'react';
import { AppContainer } from './components/AppContainer';
import { BodyText, HeadingText, SelectableText } from './components/text';
import {
  Button,
  Linking,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import {
  getAccountPhrase,
  LightAccount,
  EoaAccount,
} from '@rly-network/mobile-sdk';
import { RlyCard } from './components/RlyCard';
import { LoadingModal, StandardModal } from './components/LoadingModal';

export const AccountOverviewScreen = (props: {
  smartAccount: LightAccount;
  smartAccountAddress: string | undefined;
}) => {
  const [performingAction, setPerformingAction] = useState<string>();

  const [balance, setBalance] = useState<number>();

  const [transferBalance, setTransferBalance] = useState('');
  const [transferAddress, setTranferAddress] = useState('');

  const [mnemonic, setMnemonic] = useState<string>();

  const fetchBalance = useCallback(async () => {
    const bal = await props.smartAccount.getErc20BalanceDisplay();
    setBalance(bal);
  }, [props.smartAccount]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  const claimRlyTokens = async () => {
    setPerformingAction('Registering Account');
    const hash = await props.smartAccount.claimRly();
    await props.smartAccount.confirmUserOperation(hash);
    await fetchBalance();
    setPerformingAction(undefined);
  };

  const transferTokens = async () => {
    setPerformingAction('Transfering Tokens');
    const hash = await props.smartAccount.transferErc20(
      transferAddress,
      parseInt(transferBalance, 10)
    );
    await props.smartAccount.confirmUserOperation(hash);
    await fetchBalance();
    setPerformingAction(undefined);
    setTransferBalance('');
    setTranferAddress('');
  };

  const deleteAccount = async () => {
    await EoaAccount.permanentlyDeleteAccount();
  };

  const revealMnemonic = async () => {
    const value = await getAccountPhrase();

    if (!value) {
      throw 'Something went wrong, no Mnemonic when there should be one';
    }

    setMnemonic(value);
  };

  return (
    <>
      <AppContainer>
        <ScrollView>
          <View style={styles.alignMiddle}>
            <HeadingText>Welcome to RLY</HeadingText>
          </View>

          <View style={styles.addressContainer}>
            <SelectableText>
              Smart Account Address:{' '}
              {props.smartAccountAddress || 'No Smart Account Exists'}
            </SelectableText>
          </View>
          <RlyCard style={styles.balanceCard}>
            <View style={styles.balanceContainer}>
              <BodyText>Your Current Balance Is</BodyText>
              <HeadingText>{balance}</HeadingText>
            </View>
            <View style={styles.balanceContainer}>
              <Button
                title="View on Polygon"
                onPress={() => {
                  Linking.openURL(
                    `https://mumbai.polygonscan.com/address/${props.smartAccountAddress}`
                  );
                }}
              />
            </View>
          </RlyCard>
          <View
            style={Object.assign({}, styles.balanceCard, styles.alignMiddle)}
          >
            <BodyText>What Would You Like to Do?</BodyText>
          </View>

          <RlyCard style={styles.balanceCard}>
            <View style={styles.alignMiddle}>
              <BodyText>Register My Account</BodyText>
            </View>
            <Button onPress={claimRlyTokens} title="Claim RLY" />
          </RlyCard>

          <RlyCard style={styles.balanceCard}>
            <View style={styles.alignMiddle}>
              <BodyText>Transfer RLY</BodyText>
            </View>
            <View>
              <BodyText>Recipient</BodyText>
              <TextInput
                style={styles.input}
                value={transferAddress}
                onChangeText={setTranferAddress}
              />
            </View>
            <View>
              <BodyText>Amount</BodyText>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={transferBalance}
                onChangeText={setTransferBalance}
              />
            </View>
            <Button onPress={transferTokens} title="Transfer" />
          </RlyCard>

          <RlyCard style={styles.balanceCard}>
            <View style={styles.alignMiddle}>
              <BodyText>Export Your Account</BodyText>
            </View>
            <Button title="Reveal my Mnemonic" onPress={revealMnemonic} />
          </RlyCard>
          <RlyCard style={styles.balanceCard}>
            <View style={styles.alignMiddle}>
              <BodyText>Delete Your EOA Account</BodyText>
            </View>
            <Button
              title="Delete my on device account"
              onPress={deleteAccount}
            />
          </RlyCard>
        </ScrollView>
      </AppContainer>

      <StandardModal show={!!mnemonic}>
        <View>
          <View>
            <BodyText>Copy The Phrase below to export your wallet</BodyText>
          </View>
          <View style={styles.balanceCard}>
            <SelectableText>{mnemonic}</SelectableText>
          </View>
          <View style={styles.balanceCard}>
            <Button
              title="Close"
              onPress={() => {
                setMnemonic(undefined);
              }}
            />
          </View>
        </View>
      </StandardModal>

      <LoadingModal
        title={performingAction || 'Loading'}
        show={!!performingAction}
      />
    </>
  );
};

export const styles = StyleSheet.create({
  alignMiddle: {
    alignItems: 'center',
  },
  balanceCard: {
    marginTop: 24,
  },
  balanceContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressContainer: {
    marginTop: 16,
  },
  input: {
    height: 40,
    padding: 10,
    marginVertical: 12,
    color: 'white',
    backgroundColor: '#3A3A3A',
    borderRadius: 8,
    borderWidth: 0,
  },
});
