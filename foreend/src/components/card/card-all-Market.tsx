// @ts-nocheck
import React,{Component} from 'react'
import {PageHeader, Tabs, Button, Descriptions, Tag, Modal, Input, Form, InputNumber, message} from 'antd';

import web3 from "../../utils/web3";
import contract from "../../utils/contracts";

const a0=["写区块链","赶ddl","吃肯德基","摸鱼","划水","蹦迪","点外卖","植发","逛淘宝","斗地主"]
const a1=["在紫金港","在玉泉","在西溪","在之江","在华家池","在海宁","在舟山","在启真湖底","在管院楼上","在区块链课上"]
const a2=["的刺猬","的猫","的狗","的猪","的鸡","的兔子","的老鼠","的牛","的羊","的蛇"];
const a3=["红眼睛","橙眼睛","黄眼睛","绿眼睛","青眼睛","蓝眼睛","紫眼睛","黑眼睛","白眼睛","灰眼睛"];
const a4=["红鼻子","橙鼻子","黄鼻子","绿鼻子","青鼻子","蓝鼻子","紫鼻子","黑鼻子","白鼻子","灰鼻子"];
const a5=["红耳朵","橙耳朵","黄耳朵","绿耳朵","青耳朵","蓝耳朵","紫耳朵","黑耳朵","白耳朵","灰耳朵"];
const a6=["红嘴巴","橙嘴巴","黄嘴巴","绿嘴巴","青嘴巴","蓝嘴巴","紫嘴巴","黑嘴巴","白嘴巴","灰嘴巴"];

const { TabPane } = Tabs;

/**
 * footer
 */
 interface IProps {
    product: any
}
function getInfo (values:any){
    let len= 0
    let temp = values
    let des = ""
    while (temp>0){
        temp = parseInt(temp / 10);
        len++;
    }
    temp = values
    while (temp>0){
        len--;
        if (len==6){
            des+=a6[temp%10];
        }
        if (len==5){
            des+=a5[temp%10];
        }
        if (len==4){
            des+=a4[temp%10];
        }
        if (len==3){
            des+=a3[temp%10];
        }
        if (len==2){
            des+=a2[temp%10];
        }
        if (len==1){
            des+=a1[temp%10];
        }
        if (len==0){
            des+=a0[temp%10];
        }
        temp =parseInt(temp/10);
        //console.log(temp)
    }
    //console.log(des);
    return des;
}
class CardAllMarket extends Component<IProps> {

    formRef = React.createRef()

    constructor(props: IProps) {
        super(props)
    }

    state = {
        modalVisible: false,
        tabInUse: 1,
        isConnected: false,
        address: "",
        buttonDisable: true,
        tagColor: "blue",
        NFTState: "进行中",
        nftname:"",
        nftdes:"",
        s:""
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
            let product = this.props.product;
            let flag = 0;
            let curTime = new Date().getTime() / 1000;
            const product1 = await contract.methods.deals(product.aucid).call();
            if (product1.auctionEndTime < curTime)
            {
                if (product.highestBid>0){
                    flag = 1;
                }
                else{
                    flag = 2;
                }
            }
            ////console.log(product);
            if(flag == 1 ) {
                this.setState({
                    NFTState: "卖出",
                    tagColor:"green"
                })
            }
            else if(flag == 2) {
                this.setState({
                    NFTState: "流拍",
                    tagColor:"red"
                })
            }
            else {
                this.setState({
                    NFTState: "进行中",
                    tagColor:"blue"
                })
            }
            const nft = await contract.methods.stores(this.props.product.nftid).call();
            this.setState({
                nftname: nft.name,
                nftdes: nft.description
            })
            let sp = nft.sp;
            this.setState({
                s : getInfo(sp)
            })
            if(flag == 0) {
                this.setState({
                    buttonDisable: false
                })
            }
        }
    }

    // @ts-ignore
    Content = ({ children }) => (
        <div className="content">
            <div className="main" >{children}</div>
        </div>
    );

    async involveAucSubmit(values: any){
        let amount = web3.utils.toWei(values.amount.toString(), 'ether');
        let id = this.props.product.aucid;
        try {
            let ret = await contract.methods.bid(id,amount).send({
                from: this.state.address,

            })
            message.success('成功竞拍!');
            window.location.href = '/home';
        }
        catch(e){
            message.error('竞拍失败，请检查！');
        }
    }


    renderContent = (column = 2) => (
        <Descriptions size="small" column={column}>
            <Descriptions.Item label="名字">{this.state.nftname}</Descriptions.Item>
            <Descriptions.Item label="NFT属性">
                {this.state.s}
            </Descriptions.Item>
            <Descriptions.Item label="项目描述">
                {this.state.nftdes}
            </Descriptions.Item>
            <Descriptions.Item label="起拍时间">
                {this.props.product.auctionStartTime}
            </Descriptions.Item>
            <Descriptions.Item label="截止时间">
                {this.props.product.auctionEndTime}
            </Descriptions.Item>
            <Descriptions.Item label="起拍价">
                <a>{this.props.product.startPrice}ETH</a>
            </Descriptions.Item>
            <Descriptions.Item label="当前最高出价">
                <a>{this.props.product.highestBid}ETH</a>
            </Descriptions.Item>
        </Descriptions>
    );

    render() {
        return (
            <div style={{boxShadow: "2px 2px 1px 2px #888", margin: "5px"}}>
                <PageHeader
                    className="site-page-header-responsive"
                    title={this.props.product.projectName}
                    tags={<Tag color={this.state.tagColor}>{this.state.NFTState}</Tag>}
                    extra={[
                        <Button key="1" type="primary" disabled={this.state.buttonDisable} onClick={() => {
                            this.setState({
                                modalVisible: true
                            })
                        }}>
                            竞拍
                        </Button>
                    ]}
                >
                    <this.Content >{this.renderContent()}</this.Content>
                </PageHeader>
                <Modal
                    visible={this.state.modalVisible}
                    title="竞拍"
                    okText="提交"
                    cancelText="取消"
                    onCancel={() => {
                        this.setState({
                            modalVisible: false
                        })
                    }}
                    onOk={() => {
                        this.formRef
                            .current
                            .validateFields()
                            .then((values: any) => {
                                // 重置表单并且提交表单
                                this.formRef.current.resetFields();
                                this.involveAucSubmit(values);
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
                            name="amount"
                            label="竞拍金额"
                            rules={[{ required: true, message: '必须填写金额!' }]}
                        >
                            <InputNumber />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }

    onTabChange = (activeKey: any) => {
        this.setState({
            tabInUse: activeKey
        })
    };
}

export default CardAllMarket