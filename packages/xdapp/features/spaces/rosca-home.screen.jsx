import { Box, Text, Icon, FlatList } from '@clixpesa/native-base';
import { useState, useCallback } from 'react';
import { Feather } from '@expo/vector-icons';
import { RefreshControl } from 'react-native';

import {
  SectionHeader,
  TransactionItem,
  RoscaFeatureCard,
  PotProgressCard,
} from '@clixpesa/xdapp/components';
import { roundDetails, transactions, rates } from '@clixpesa/xdapp/data';

export default function RoscaHomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    wait(2000).then(async () => {
      setRefreshing(false);
    });
  }, []);

  let totalBalance = 0;
  return (
    <Box flex={1} bg="muted.100" alignItems="center">
      <FlatList
        width="95%"
        data={transactions}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={
          <Box>
            <RoscaFeatureCard
              color="warmGray.800"
              bg="white"
              balance={totalBalance.toFixed(4).toString()}
              apprxBalance={(totalBalance * 120.75).toFixed(2).toString()}
              btn1={{
                icon: <Icon as={Feather} name="plus" size="md" color="primary.600" mr="1" />,
                name: 'Fund',
                screen: 'depositFunds',
              }}
              btn2={{
                icon: <Icon as={Feather} name="arrow-down" size="md" color="primary.600" mr="1" />,
                name: 'Withdraw',
                screen: 'sendFunds',
              }}
              btn3={{
                icon: <Icon as={Feather} name="more-horizontal" size="lg" color="primary.600" />,
                name: 'More',
                screen: 'DummyModal',
              }}
              itemBottom={false}
            />
            <SectionHeader
              title={'Round No.' + roundDetails.roundNo}
              actionText={'For: ' + roundDetails.roundOwner}
              action={() => console.log('See all')}
            />
            <PotProgressCard
              roundBal={roundDetails.roundBal}
              goalAmount={roundDetails.roundGoal}
              dueDate={roundDetails.roundDueDate}
              memberCount={roundDetails.memberCount}
              ctbCount={roundDetails.ctbCount}
              myCtb={roundDetails.myContribution}
              token={roundDetails.token}
            />
            {transactions.length > 0 ? (
              <SectionHeader
                title="Transactions"
                actionText="See all"
                action={() => console.log('See all')}
              />
            ) : null}
          </Box>
        }
        renderItem={({ item, index }) => (
          <Box
            bg="white"
            opacity={85}
            roundedTop={index === 0 ? '2xl' : 'md'}
            roundedBottom={index === transactions.length - 1 ? '2xl' : 'md'}
            mt={1}
          >
            <TransactionItem
              key={item.id}
              credited={item.credited}
              trTitle={item.title}
              trDate={item.date}
              spAmount={
                (item.credited ? '+' : '-') + (item.amount * 1).toFixed(2) + ' ' + item.token
              }
              eqAmount={(item.amount * rates[item.token]).toFixed(2) + ' KES'}
              screen="DummyModal"
            />
          </Box>
        )}
        keyExtractor={(item) => item.id}
      />
    </Box>
  );
}
