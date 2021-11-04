import React, {Component} from "react";
import {Button, Form, Input, List, Modal} from "antd";
import CardAllMarket from "../../../components/card/card-all-Market";

import web3 from "../../../utils/web3";
import contract from "../../../utils/contracts";

class NFTMarket extends Component {

    state ={
        Products: [],
        NFTs: [],
        ProductsNum: 0,
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
            let numProducts = await contract.methods.aucIndex().call();
            let products = [];
            for(let i = 0; i < numProducts; i++) {
                await contract.methods.check(i).call();
                const product = await contract.methods.deals(i).call();
                this.formatItem(product, i)
                products.push(product);
            }
            this.setState({
                Products: products,
                ProductsNum: numProducts
            })
        }
    }

    private formatItem(data: any, index: number) {
        ////console.log(data);
        data.aucid = index;
        data.startPrice = web3.utils.fromWei(data.startPrice, 'ether')
        data.highestBid = web3.utils.fromWei(data.highestBid, 'ether')
        data.auctionStartTime = this.formatTime(data.auctionStartTime)
        data.auctionEndTime = this.formatTime(data.auctionEndTime)
        ////console.log(data)
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
                    dataSource={this.state.Products}
                    renderItem={(item ) => (
                        <List.Item>
                            <CardAllMarket product={item}/>
                        </List.Item>
                    )}
                />
            </div>
        )
    }
}

export default NFTMarket;