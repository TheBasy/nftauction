pragma solidity >=0.4.22 <0.6.0;

contract NFTAuction{
    enum EnableSale { Yes , No }
    enum NFTStatus { Open, Sold, Unsold }
    struct NFT{
        uint id;
        string name;
        string description;
        address payable presentowner;
        address lastowner;
        uint sp;
        uint numown;
        EnableSale state;
    }
    struct Item{
        uint aucid;
        uint nftid;
        uint auctionStartTime;
        uint auctionEndTime;
        uint startPrice;
        uint highestBid;
        address lastowner;
        address highestBidder;
        NFTStatus status;
    }
    uint public nftIndex;
    uint public aucIndex;
    mapping (uint => Item) public deals;
    mapping (uint => address[]) public own;
    mapping (uint => NFT) public stores;
    
    constructor() public{
        nftIndex = 0;
        aucIndex = 0;
    }
    
    function addNFT(string memory _name, string memory _description,uint sp) payable public{
        NFT memory nft = NFT(nftIndex, _name,_description,msg.sender,msg.sender,sp,1,EnableSale.Yes);
        stores[nftIndex] = nft;
        own[nftIndex].push(msg.sender);
        nftIndex += 1;
    }
    
    function addItem(uint _nftid,uint _auctionStartTime, uint _auctionEndTime 
    , uint _startPrice  ) public {
        require(_auctionStartTime < _auctionEndTime, "Auction start time should be earlier than end time.");
        require(_startPrice>0,"Start Price should be positive.");
        NFT memory nft = stores[_nftid];
        require(nft.presentowner == msg.sender,"This is not your NFT.");
        require(nft.state == EnableSale.Yes,"It can't be sold");
        Item memory item= Item(aucIndex, _nftid, _auctionStartTime,_auctionEndTime,_startPrice,0,nft.presentowner,nft.presentowner,NFTStatus.Open);
        nft.state=EnableSale.No;
        deals[aucIndex] = item;
        aucIndex += 1;
    }
    
    
    function check(uint _aucid) public {
        Item storage item = deals[_aucid];
        if (item.auctionEndTime < now){
            if (item.highestBid>0){
                item.status = NFTStatus.Sold;
            }
            else{
                item.status = NFTStatus.Unsold;
            }
        }
        
    }
    
    function checksale(uint _nftid) public {
        NFT storage nft = stores[_nftid];
        if (nft.state == EnableSale.Yes){
            nft.state = EnableSale.No;
        }
        else{
            for (uint i=aucIndex-1;i>=0;i--){
                Item storage item = deals[i];
                if (item.nftid == _nftid){
                    if (item.status == NFTStatus.Unsold){
                        nft.state = EnableSale.Yes;
                        break;
                    }
                    if (item.status == NFTStatus.Sold && item.highestBidder == nft.presentowner){
                        nft.state = EnableSale.Yes;
                        break;
                    }
                }
            }
        }
    }
    
    function getDate() public view returns(uint ){
        return now;
    }
    
    function bid(uint _aucid, uint value) public returns (bool){
        Item storage item = deals[_aucid];
        require(now >= item.auctionStartTime, "Current time should be later than auction start time");
        require(now <= item.auctionEndTime, "Current time should be earlier than auction end time");
        require(item.status == NFTStatus.Open,"This NFT is not for sale");
        require(value >= item.startPrice, "Value should be larger than start price");
        require(value > item.highestBid, "Value should be larger than present price");
        item.highestBid = value;
        item.highestBidder = msg.sender;
        return true;
    }
    
    function payNFT(uint _aucid) payable public{
        Item storage item = deals[_aucid];
        require(item.highestBidder==msg.sender);
        require(item.highestBid==msg.value,"Wrong amount of money");
        NFT storage nft = stores[item.nftid];
        nft.state = EnableSale.Yes;
        nft.presentowner.transfer(msg.value);
        nft.lastowner = nft.presentowner;
        nft.presentowner = msg.sender;
        nft.numown += 1;
        own[nft.id].push(msg.sender);
    }
    
}