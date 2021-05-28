const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const provider = ganache.provider();
const web3 = new Web3(provider);

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({data: compiledFactory.bytecode})
    .send({from: accounts[0], gas: '1000000'});

    await factory.methods.createCampaign('100').send({
        from: accounts[0],
        gas: '1000000'
    });

    // JS es6 syntax, first element of array
    // equivalent code:
    // const addresses = await ....
    // campaignAddress = addresses[0]
    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
    
    // create javascript representation of contract that exist at address campaignAddress
    // if already deployed, instruct where it is in blockchain by passing in address
    campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface),
        campaignAddress
    );

});

describe('Campaign Contracts',() => {
    it('deploys both contracts', () => {
        assert.ok(campaign.options.address);
        assert.ok(factory.options.address);
    });

    // manager is accounts[0]
    it('caller is campaign manager',async () => {
        const manager = await campaign.methods.manager().call();
        assert.strictEqual(manager, accounts[0]);
    });

    it('allows people to contribute money and marks as approver', async() => {
        await campaign.methods.contribute().send({
            from: accounts[1],
            gas: '1000000',
            value: '1000'
        });
        const contributed = await campaign.methods.approvers(accounts[1]).call();
        assert.ok(contributed > 0);
    });

    it('require minimum contributed', async () => {
        try{
            await campaign.methods.contribute().send({
                from: accounts[1],
                gas: '1000000',
                value: '99'
            });
            assert(false);
        }catch(err){
            assert(err);
        }
    });

    it('allows manager to make payment request', async ()=> {
        await campaign.methods.createRequest('Buy batteries', '100', accounts[1]).send({
            from: accounts[0],
            gas: '1000000'
        });
        const request = await campaign.methods.requests(0).call();
        assert.strictEqual('Buy batteries', request.description);
    });

    it('non-manager cannot make payment request', async ()=> {
        try{
            await campaign.methods.createRequest('Buy batteries', '100', accounts[1]).send({
                from: accounts[1],
                gas: '1000000'
            });
            assert(false);
        }catch(err){
            assert(err);
        }
    });

    it('processes requests', async() => {
        await campaign.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei('10', 'ether')
        });

        await campaign.methods.createRequest('Buy batteries', web3.utils.toWei('5', 'ether'), accounts[1]).send({
            from: accounts[0],
            gas: '1000000'
        });

        await campaign.methods.approveRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        let balance = await web3.eth.getBalance(accounts[1]);
        balance = web3.utils.fromWei(balance, 'ether');
        balance = parseFloat(balance);
        assert(balance > 104);
    });

});
