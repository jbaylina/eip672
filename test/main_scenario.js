/* eslint-env mocha */
/* eslint-disable no-await-in-loop */
const TestRPC = require('ethereumjs-testrpc');
const Web3 = require('web3');
const chai = require('chai');

const tr = require('../js/test.js');

const ensSimulator = require('ens-simulator');

const assert = chai.assert;

describe('EnsPseudoIntrospection test', () => {
  let testrpc;
  let web3;
  let ens;
  let accounts;
  let implementer;
  let checker;
  let releaser;
  let releaserNode;

  before(async () => {
    testrpc = TestRPC.server({
      ws: true,
      gasLimit: 5800000,
      total_accounts: 10,
    });

    testrpc.listen(8546, '127.0.0.1');

    web3 = new Web3('ws://localhost:8546');
    accounts = await web3.eth.getAccounts();
    ens = await ensSimulator.deployENSSimulator(web3);
  });

  after((done) => {
    testrpc.close();
    done();
  });

  it('should deploy all the contracts', async () => {
    implementer = await tr.Implementer.new(web3, { from: accounts[0], gas: 2000000 });
    checker = await tr.Checker.new(web3, { from: accounts[0], gas: 2000000 });
    releaser = await tr.Releaser.new(web3, { from: accounts[0], gas: 2000000 });
    releaserNode = await releaser.rootNode();
    assert.ok(implementer.$address);
    assert.ok(checker.$address);
  }).timeout(20000);

  it('Should check implementation via solidity', async () => {
    const IExampleAddr = await checker.implements(implementer.$address, 'IExample');
    assert.equal(IExampleAddr, implementer.$address);

    const IOtherAddr = await checker.implements(implementer.$address, 'IOtherAddr');
    assert.equal(IOtherAddr, '0x0000000000000000000000000000000000000000');

    const IEaxampleAddr2 = await ensSimulator.getProxyInterface(ens, implementer.$address, 'IExample');
    assert.equal(IEaxampleAddr2, IEaxampleAddr2);
  }).timeout(6000);

  it('should release root node ownership', async () => {
    const OwnerAddr = await ens.owner(releaserNode);
    assert.equal(OwnerAddr, accounts[0]);
  }).timeout(6000);

  it('should check implemntation after releasing root node ownership', async () => {
    const IExampleAddr = await checker.implements(releaser.$address, 'IExample');
    assert.equal(IExampleAddr, releaser.$address);

    const IOtherAddr = await checker.implements(releaser.$address, 'IOtherAddr');
    assert.equal(IOtherAddr, '0x0000000000000000000000000000000000000000')
  }).timeout(6000);
});
