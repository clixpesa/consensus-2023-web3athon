import {
  Box,
  Text,
  VStack,
  Divider,
  HStack,
  Icon,
  Pressable,
  Spacer,
  Button,
} from '@clixpesa/native-base';
import QRCode from 'react-native-qrcode-svg';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

export default function DepositScreen() {
  const walletAddress = '0xTHISAMPLE0000000000000000000'; //useSelector((s) => s.wallet.walletInfo.address);
  return (
    <Box flex={1} bg="primary.50" alignItems="center">
      <VStack width="95%" bg="white" mt={3} rounded="2xl">
        <Box alignSelf="center" py={6}>
          <QRCode value={walletAddress} width="95%" />
          <Text mt={3} alignSelf="center" fontWeight="medium">
            $Akimbo6856
          </Text>
        </Box>
        <Divider width="85%" alignSelf="center" />
        <HStack p={3} justifyContent="space-between" justifyItems="center">
          <Box width="70%">
            <Text color="text.600">Wallet Address</Text>
            <Text fontWeight="medium">{walletAddress}</Text>
          </Box>
          <Pressable p={3}>
            <Icon as={Ionicons} name="ios-copy" size="lg" color="text.400" />
          </Pressable>
        </HStack>
        <HStack p={3} justifyContent="space-between" justifyItems="center">
          <Box width="70%">
            <Text color="text.600">Network</Text>
            <Text fontWeight="medium">XDC Testnet (XRC20)</Text>
          </Box>
          <Pressable p={3}>
            <Icon as={Ionicons} name="md-swap-horizontal" size="lg" color="text.400" />
          </Pressable>
        </HStack>
        <Divider width="85%" alignSelf="center" />
        <Box pl={3} py={3} pr={6}>
          <HStack justifyContent="space-between">
            <Text>Minimum deposit</Text>
            <Text fontWeight="medium">1.00 USXD</Text>
          </HStack>
          <HStack justifyContent="space-between">
            <Text>Expected arrival</Text>
            <Text fontWeight="medium">12 block confirmations</Text>
          </HStack>
        </Box>
      </VStack>
      <Spacer />
      <HStack space={3} bottom="10">
        <Button
          variant="subtle"
          bg="primary.100"
          rounded="3xl"
          pr="4"
          minW="40%"
          _text={{ color: 'text.900', fontWeight: 'semibold', mb: '0.5' }}
          onPress={() => console.log('Share image')}
        >
          Save Image
        </Button>
        <Button
          bg="warmGray.800"
          rounded="3xl"
          pr="4"
          minW="40%"
          _text={{ color: 'text.50', fontWeight: 'semibold', mb: '0.5' }}
          onPress={() => console.log('Share Address')}
        >
          Share Address
        </Button>
      </HStack>
    </Box>
  );
}
