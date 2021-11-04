import React, {Component} from "react";
import {Button, Form, Input, List, Modal} from "antd";

import web3 from "../../../utils/web3";
import contract from "../../../utils/contracts";
import CardMyAuction from "../../../components/card/card-my-Auction";

class MyAuction extends Component {

    state ={
        myAuctions: [],
        myAuctionsNum: 0,
        isConnected: false,
        address: ""
    }

    async componentDidMount() {
        let accounts = await web3.eth.getAccounts()
        if(accounts.length == 0) {
            this.setState({
                isConnected: false
            })
        }
        else {
            await this.setState({
                isConnected: true,
                address: accounts[0]
            })
            let numAuctions = await contract.methods.aucIndex().call();
            let auctions = [];
            let num = 0;

            for(let i = 0; i < numAuctions; i++) {
                await contract.methods.check(i).call();
                let product = await contract.methods.deals(i).call();
                //console.log(product);
                const nft = await contract.methods.stores(product.nftid).call();
                this.formatItem(product, i)
                //console.log(product)
                if (product.highestBidder == this.state.address && nft.presentowner!=this.state.address) {
                    auctions.push(product);
                    num++;
                }
            }

            this.setState({
                myAuctions: auctions,
                myAuctionsNum: num,
            })
        }
    }

    private formatItem(data: any, index: number) {
        data.aucid = index;
        data.startPrice = web3.utils.fromWei(data.startPrice, 'ether')
        data.highestBid = web3.utils.fromWei(data.highestBid, 'ether')
        data.auctionStartTime = this.formatTime(data.auctionStartTime)
        data.auctionEndTime = this.formatTime(data.auctionEndTime)
    }

    private formatTime(time: string) {
        var d = new Date(parseInt(time) * 1000);
        return (d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds());
    }

    render() {
        // @ts-ignore
        return (
            <div>
                <List
                    itemLayout="horizontal"
                    dataSource={this.state.myAuctions}
                    renderItem={(item) => (
                        <List.Item>
                            <CardMyAuction product={item} />
                        </List.Item>
                    )}
                />
            </div>
        )
    }
}

export default MyAuction;