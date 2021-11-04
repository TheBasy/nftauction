// @ts-nocheck
import React, {Component} from 'react';

import { Layout, Tabs, Button, Modal, Form, Input, InputNumber, message } from 'antd';

import NFTMarket from "./nft-market";
import MyAuction from "./my-auction";
import MyNFT from "./my-nft";

import web3 from "../../utils/web3";
import contract from "../../utils/contracts";



const { Content } = Layout;
const { TabPane } = Tabs;

function randomNum(n){ 
    var t=''; 
    for(var i=0;i<n;i++){ 
    t+=Math.floor(Math.random()*10); 
    } 
    return t; 
} 

class HomePage extends Component {

    formRef = React.createRef()

    state = {
        modalVisible: false,
        isConnected: false,
        address: ""
    }

    async componentDidMount() {
        let accounts = await web3.eth.getAccounts()
        if (accounts.length == 0) {
            this.setState({
                isConnected: false
            })
        }
        else {
            await this.setState({
                isConnected: true,
                address: accounts[0]
            })
        }
    }


     async campaignFormSubmit(values: any){
        let NFTDescription = values.NFTDescription;
        let NFTName = values.NFTName;
        let dig = values.NTFnum;
        let NFTnum = randomNum(values.NFTnum+1);
        //console.log(NFTnum);
        try {
            let ret = await contract.methods.addNFT(NFTName, NFTDescription ,NFTnum).send({
                from: this.state.address,
                value:dig
            })

            //console.log(dig);
            message.success('成功铸造NFT!');
            window.location.href = '/home';
        }
        catch(e){
            message.error('铸造NFT失败，请检查！');
        }
    }

    render() {

        // @ts-ignore
        return (
            <Content style={{ padding: '50px' }}>
                <Tabs defaultActiveKey="1" tabBarExtraContent={
                    <Button
                        disabled={!this.state.isConnected}
                        type={"primary"}
                        onClick={() => {
                            this.setState({
                                modalVisible: true
                            })
                        }}>
                        铸造NFT
                    </Button>
                }>
                    <TabPane tab="拍卖市场" key="1">
                        <NFTMarket />
                    </TabPane>
                    <TabPane tab="我的NFT" key="2">
                        <MyNFT />
                    </TabPane>
                    <TabPane tab="我的拍卖" key="3">
                        <MyAuction />
                    </TabPane>
                </Tabs >
                <Modal
                    visible={this.state.modalVisible}
                    title="铸造NFT"
                    okText="提交"
                    cancelText="取消"
                    onCancel={() => {
                        this.setState({
                            modalVisible: false
                        })
                    }}
                    onOk={() => {
                        // @ts-ignore
                        this.formRef
                            .current
                            .validateFields()
                            .then((values: any) => {
                                // 重置表单并且提交表单
                                this.formRef.current.resetFields();
                                this.campaignFormSubmit(values);
                            })
                            .catch((info: any) => {
                                ////console.log('Validate Failed:', info);
                            });
                    }}
                >
                    <Form
                        ref={this.formRef}
                        layout="vertical"
                        name="campaignForm"
                        initialValues={{ modifier: 'public' }}
                    >
                        <Form.Item
                            name="NFTName"
                            label="NFT名称"
                            rules={[{ required: true, message: '必须填写名称!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="NFTnum"
                            label="NFT投入"
                            rules={[{ required: true, message: '必须填写名称!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="NFTDescription"
                            label="NFT描述"
                        >
                            <Input type="textarea" />
                        </Form.Item>
                    </Form>
                </Modal>
            </Content>

        )
    }
}

export default HomePage;