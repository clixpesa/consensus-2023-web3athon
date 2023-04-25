require("@nomicfoundation/hardhat-toolbox");
require('hardhat-deploy')
require('hardhat-abi-exporter')
require('@nomiclabs/hardhat-ethers')

const defaultNetwork = 'localhost'
const mnemonicPath = "m/44'/52752'/0'/0" // derivation path used by Celo
const acc1 = ''
const acc2 = ''

// This is the mnemonic used by celo-devchain
const DEVCHAIN_MNEMONIC =
  'concert load couple harbor equip island argue ramp clarify fence smart topic'

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
    networks: {
    localhost: {
      url: 'http://127.0.0.1:8545',
      accounts: {
        mnemonic: DEVCHAIN_MNEMONIC,
      },
    },
    alfajores: {
      url: 'https://alfajores-forno.celo-testnet.org',
      accounts: [acc1, acc2],
      gasPrice: 100000000,
      gas: 35000000,
      chainId: 44787,
      loggingEnabled: true,
    },
    alfajoresDatahub: {
      url: 'https://celo-alfajores--rpc.datahub.figment.io/apikey/<API KEY>',
      accounts: [acc1, acc2],
      chainId: 44787,
    },
  },
  namedAccounts: {
    deployer: 0,
  },
    typechain: {
    outDir: 'types',
    target: 'ethers-v5', //web3-v1
    alwaysGenerateOverloads: false, // should overloads with full signatures like deposit(uint256) be generated always, even if there are no overloads?
    externalArtifacts: ['externalArtifacts/*.json'], // optional array of glob patterns with external artifacts to process (for example external libs from node_modules)
  },
};

task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(account.address)
  }
})

task(
  'devchain-keys',
  'Prints the private keys associated with the devchain',
  async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners()
    const hdNode = hre.ethers.utils.HDNode.fromMnemonic(DEVCHAIN_MNEMONIC)
    for (let i = 0; i < accounts.length; i++) {
      const account = hdNode.derivePath(`m/44'/60'/0'/0/${i}`)
      console.log(`Account ${i}\nAddress: ${account.address}\nKey: ${account.privateKey}`)
    }
  },
)
