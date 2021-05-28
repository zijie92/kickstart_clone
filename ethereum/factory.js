import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';
import config from '../config.json';

const instance = new web3.eth.Contract(
    //contract ABI
    JSON.parse(CampaignFactory.interface),
    config.contract_address
);

export default instance;