import React, {Component} from "react";
import {Button, Form, Input, List, Modal} from "antd";

import web3 from "../../../utils/web3";
import contract from "../../../utils/contracts";
import CardMyNFT from "../../../components/card/card-my-NFT";
class MyNFT extends Component {

    state ={
        MyNFTs: [],
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

            let numNFTs = await contract.methods.nftIndex().call();
            ////console.log(numNFTs);
            let nfts = [];
            for(let i = 0; i < numNFTs; i++) {
                const nft = await contract.methods.stores(i).call();
                this.formatNFT(nft, i)
                ////console.log(nft)
                
                if(nft.presentowner == this.state.address) {
                    nfts.push(nft);
                }
            }
            this.setState({
                MyNFTs: nfts,
            })
        }
    }

    private formatNFT(data: any, index: number) {
        data.id = index;
        data.name = data.name;
        data.description = data.description;
        data.presentowner = data.presentowner;
        data.lastowner = data.lastowner;
        data.state = data.state;
    }



    render() {
        // @ts-ignore
        return (
            <div>
                <List
                    itemLayout="horizontal"
                    dataSource={this.state.MyNFTs}
                    renderItem={(item) => (
                        <List.Item>
                            <CardMyNFT nft={item}/>
                        </List.Item>
                    )}
                />
            </div>
        )
    }
}

export default MyNFT;