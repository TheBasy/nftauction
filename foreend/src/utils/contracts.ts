import NFTAuction from './NFTAuction.json'
import web3 from './web3'

var contractAddr = "0x746ABc3fb7D311eDF15B466C049357AD208F27c0"
const NFTAuctionABI = NFTAuction.abi

// @ts-ignore
const contract = new web3.eth.Contract(NFTAuctionABI, contractAddr);

export default contract
