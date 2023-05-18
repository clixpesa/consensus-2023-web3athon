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

  it('Should create a personal space for ADD1 named Car Savings', async function () {
    const deadline = new Date(Date.now() + 86400000)
    const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 10)
    const savingsData = {
      token: '0x1e2913E1aC339a4996353f8F58BE0de3D109b5A5',
      owner: addr1.address,
      spaceName: 'Car Savings',
      imgLink: 'bit.ly/hthfdrer',
      spaceId: "PS" + nanoid(),
      goalAmount: ethers.utils.parseUnits('1', 6).toString(),
      deadline: Date.parse(deadline.toDateString() + ' 11:59 pm') 
    }
    const txResponse = await Personal.createPersonalSpace(Object.values(savingsData))
    const txReceipt = await txResponse.wait()
    const thisLog = txReceipt.logs.find((el) => el.address === Personal.address)
    const results = PersonalIface.parseLog({ data: thisLog.data, topics: thisLog.topics })
    expect(results.args[1][4]).to.be.equal(savingsData.spaceId)
  })

  it('Should create a personal space for ADD2 named Mjengo Nyumbani', async function () {
    const deadline = new Date(Date.now() + 172800000)
    const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 10)
    const savingsData = {
      token: '0x1e2913E1aC339a4996353f8F58BE0de3D109b5A5',
      owner: addr2.address,
      spaceName: 'Mjengo Nyumbani',
      imgLink: 'bit.ly/hthfdrer',
      spaceId: "PS" + nanoid(),
      goalAmount: ethers.utils.parseUnits('2', 6).toString(),
      deadline: Date.parse(deadline.toDateString() + ' 11:59 pm') 
    }
    const txResponse = await Personal.connect(addr2).createPersonalSpace(Object.values(savingsData))
    const txReceipt = await txResponse.wait()
    const thisLog = txReceipt.logs.find((el) => el.address === Personal.address)
    const results = PersonalIface.parseLog({ data: thisLog.data, topics: thisLog.topics })
    expect(results.args[1][1]).to.be.equal(addr2.address)
  })

  it('Should return all personal spaces', async function () {
    const personalSpaces = await Personal.getAllPersonalSpaces()
    expect(personalSpaces.length).to.be.equal(2)
  })

  it('Should return all personal spaces for ADD1', async function () {
    const personalSpaces = await Personal.getPersonalSpacesByOwner(addr1.address)
    const myPersonalSpaces = await Personal.getMyPersonalSpaces()
    expect(personalSpaces.length).to.be.equal(myPersonalSpaces.length)
  })

  it('Should return ADD2 personal spaces by ID', async function () {
    const personalSpaces = await Personal.getPersonalSpacesByOwner(addr2.address)

    const thisPersonalSpace = await Personal.getPersonalSpaceById(personalSpaces[0][0][4])
    expect(thisPersonalSpace[0][1]).to.be.equal(addr2.address)
  })

  it('Should check if personal space exists', async function () {
    const isExistent = await Personal.doesPersonalSpaceExist(addr1.address, 'PS1234567890')
    expect(isExistent).to.be.equal(false)
  })

  it('Should fund ADD1 personal space', async function () {
    const amount = ethers.utils.parseUnits('1', 6)
    const spaceBal = await Token.balanceOf(Personal.address)
    await Token.connect(addr1).approve(Personal.address, amount)
    delay(8000)
    const personalSpaces = await Personal.getPersonalSpacesByOwner(addr1.address)
    const thisPersonalSpaceBal = personalSpaces[0][1]
    const txResponse = await Personal.fundPersonalSpace(personalSpaces[0][0][4], amount)
    const txReceipt = await txResponse.wait()
    const thisLog = txReceipt.logs.find((el) => el.address === Personal.address)
    const results = PersonalIface.parseLog({ data: thisLog.data, topics: thisLog.topics })
    expect(results.args[2]).to.be.equal(amount.toString())
    expect(spaceBal.add(amount)).to.be.equal(await Token.balanceOf(Personal.address))
    const personalSpaces2 = await Personal.getPersonalSpacesByOwner(addr1.address)
    expect(thisPersonalSpaceBal.add(amount)).to.be.equal(personalSpaces2[0][1])
  }) 

  it('Should withdraw from ADD1 personal space', async function () {
    const amount = ethers.utils.parseUnits('0.5', 6)
    const spaceBal = await Token.balanceOf(Personal.address)
    const userBal = await Token.balanceOf(addr1.address)
    const personalSpaces = await Personal.getPersonalSpacesByOwner(addr1.address)
    const thisPersonalSpaceBal = personalSpaces[0][1]
    const txResponse = await Personal.withdrawFromPersonalSpace(personalSpaces[0][0][4], amount)
    const txReceipt = await txResponse.wait()
    const thisLog = txReceipt.logs.find((el) => el.address === Personal.address)
    const results = PersonalIface.parseLog({ data: thisLog.data, topics: thisLog.topics })
    expect(results.args[2]).to.be.equal(amount.toString())
    expect(spaceBal.sub(amount)).to.be.equal(await Token.balanceOf(Personal.address))
    const personalSpaces2 = await Personal.getPersonalSpacesByOwner(addr1.address)
    expect(thisPersonalSpaceBal.sub(amount)).to.be.equal(personalSpaces2[0][1])
    expect(userBal.add(amount)).to.be.equal(await Token.balanceOf(addr1.address))
  })

  it('Should update name and goalAmount ADD2 personal space', async function () {
    const personalSpaces = await Personal.getPersonalSpacesByOwner(addr2.address)
    const savingsData = {
      token: personalSpaces[0][0][0],
      owner: personalSpaces[0][0][1],
      spaceName: 'Mjengo Mpya',
      imgLink: personalSpaces[0][0][3],
      spaceId: personalSpaces[0][0][4],
      goalAmount: ethers.utils.parseUnits('2.5', 6).toString(),
      deadline: personalSpaces[0][0][6]
    }
    const txResponse = await Personal.connect(addr2).updatePersonalSpace(Object.values(savingsData))
    const txReceipt = await txResponse.wait()
    const thisLog = txReceipt.logs.find((el) => el.address === Personal.address)
    const results = PersonalIface.parseLog({ data: thisLog.data, topics: thisLog.topics })
    expect(results.args[0][0][2]).to.be.equal('Mjengo Mpya')
    expect(results.args[0][0][5]).to.be.equal(ethers.utils.parseUnits('2.5', 6).toString())
    expect(results.args[0][1]).to.be.equal(personalSpaces[0][1])
  })

  it('Should not withdraw from ADD2 personal space', async function () {
    const amount = ethers.utils.parseUnits('1', 6)
    const personalSpaces = await Personal.getPersonalSpacesByOwner(addr2.address)
    const thisPersonalSpaceBal = personalSpaces[0][1]
    await expect(Personal.connect(addr2).withdrawFromPersonalSpace(personalSpaces[0][0][4], amount)).to.be.revertedWith("Amount must be less than current balance")
    const personalSpaces2 = await Personal.getPersonalSpacesByOwner(addr2.address)
    expect(thisPersonalSpaceBal).to.be.equal(personalSpaces2[0][1])
  })

  


})