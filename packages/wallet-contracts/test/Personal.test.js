const { ethers, artifacts } = require('hardhat')
const { expect } = require('chai')
const stableTokenAbi = require('./stableToken.json')
const {customAlphabet} = require('nanoid')

describe('Clixpesa Personal Spaces', function () {
  let Personal, PersonalIface, Token, addr1, addr2
  const delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  before(async () => {
    const personalContract = await ethers.getContractFactory('Personal')
    Token = await ethers.getContractAt(stableTokenAbi, '0x1e2913E1aC339a4996353f8F58BE0de3D109b5A5')
    const signers = await ethers.getSigners()
    addr1 = signers[0]
    addr2 = signers[1]

    Personal = await personalContract.deploy()
    PersonalIface = new ethers.utils.Interface((await artifacts.readArtifact('Personal')).abi)
    await Personal.deployed()
  })

  it('Should create a personal space named Car Savings', async function () {
    const deadline = new Date(Date.now() + 86400000)
    const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 10)
    const savingsData = {
      token: '0x1e2913E1aC339a4996353f8F58BE0de3D109b5A5',
      personalName: 'Car Savings',
      imgLink: 'bit.ly/hthfdrer',
      spaceId: "PS" + nanoid(),
      goalAmount: ethers.utils.parseUnits('1', 6).toString(),
      deadline: Date.parse(deadline.toDateString() + ' 11:59 pm') 
    }

    console.log(savingsData)
    const txResponse = await Personal.createSavings(Object.values(savingsData))
    const txReceipt = await txResponse.wait()
    console.log(txReceipt)
  })
})