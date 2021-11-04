// @ts-nocheck
import React,{Component} from 'react'
import {PageHeader, Tabs, Button, Descriptions, Tag, Modal, Input, Form, InputNumber, message ,Row , Statistic} from 'antd';

import web3 from "../../utils/web3";
import contract from "../../utils/contracts";

const { TabPane } = Tabs;
const a0=["写区块链","赶ddl","吃肯德基","摸鱼","划水","蹦迪","点外卖","植发","逛淘宝","斗地主"]
const a1=["在紫金港","在玉泉","在西溪","在之江","在华家池","在海宁","在舟山","在启真湖底","在管院楼上","在区块链课上"]
const a2=["的刺猬","的猫","的狗","的猪","的鸡","的兔子","的老鼠","的牛","的羊","的蛇"];
const a3=["红眼睛","橙眼睛","黄眼睛","绿眼睛","青眼睛","蓝眼睛","紫眼睛","黑眼睛","白眼睛","灰眼睛"];
const a4=["红鼻子","橙鼻子","黄鼻子","绿鼻子","青鼻子","蓝鼻子","紫鼻子","黑鼻子","白鼻子","灰鼻子"];
const a5=["红耳朵","橙耳朵","黄耳朵","绿耳朵","青耳朵","蓝耳朵","紫耳朵","黑耳朵","白耳朵","灰耳朵"];
const a6=["红嘴巴","橙嘴巴","黄嘴巴","绿嘴巴","青嘴巴","蓝嘴巴","紫嘴巴","黑嘴巴","白嘴巴","灰嘴巴"];
/**
 * footer
 */
 interface IProps {
    nft: any
}
const showModal = () => {
    setIsModalVisible(true);
  };
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
class CardMyNFT extends Component<IProps> {

    formRef = React.createRef()

    constructor(props: IProps) {
        super(props)
    }

    state = {
        modalVisible: false,
        tabInUse: 1,
        isConnected: false,
        address: "",
        buttonDisable: false,
        tagColor: "blue",
        yon:"yes",
        owners:[],
        s:""
    }


    // @ts-ignore
    Content = ({ children }) => (
        <div className="content">
            <div className="main" >{children}</div>
        </div>
    );
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

            let nft = this.props.nft;
            this.canSaleOut(nft);
            //console.log(nft.sp)
            let sp = nft.sp;
            let temp =[]
            for (let i=0;i<nft.numown;i++){
                let a=contract.methods.own(nft.id,0).call();

                if (a) {
                    a.then(function (result) {
                    //输出
                    temp.push(result)
                })
                }
            }
            console.log(temp)
            this.setState({
                s : getInfo(sp),
                owners : temp
            })
            //console.log(this.state.s);
        }
    }
    async canSaleOut(nft: any) {
        if(nft.state==1) {
            this.setState({
                buttonDisable: true,
                yon :"No"
            })
        }
        
    }
    async SaleOut(values: any){
        let id = this.props.nft.id;
        let duration = values.duration;
        let start = web3.utils.toWei(values.start.toString(), 'ether');
        let curTime = new Date().getTime() / 1000;
        duration = curTime + duration*24*60*60;
        curTime=Math.trunc(curTime);
        duration=Math.trunc(duration);
        //console.log(id,duration,curTime,start);
        try {
            let ret = await contract.methods.addItem(id,curTime,duration,start).send({
                from: this.state.address,
            })
            ////console.log(ret);
            message.success('开放拍卖!');
            window.location.href = '/home';
        }
        catch(e){
            message.error('开放失败，请检查！');
        }
    }
    renderContent = (column = 2) => (
        <Descriptions size="small" column={column}>
            <Descriptions.Item label="名字">{this.props.nft.name}</Descriptions.Item>
            <Descriptions.Item label="拥有者">
                <a>{this.props.nft.presentowner} </a>
            </Descriptions.Item>
            <Descriptions.Item label="上一任拥有者">
                <a>{this.props.nft.lastowner} </a>
            </Descriptions.Item>
            <Descriptions.Item label="NFT属性">
                {this.state.s}
            </Descriptions.Item>
            <Descriptions.Item label="项目描述">
                {this.props.nft.description}
            </Descriptions.Item>
        </Descriptions>
    );
    render() {
        return (
            <div style={{boxShadow: "2px 2px 1px 2px #888", margin: "10px"}}>
                <PageHeader
                    className="site-page-header"
                    title={this.props.nft.id}
                    tags={<Tag color={this.state.tagColor}>{this.state.NFTState}</Tag>}
                    extra={[
                        <Button key="1" type="primary" disabled={this.state.buttonDisable} onClick={() => {
                            this.setState({
                                modalVisible: true
                            })
                        }}>
                            拍卖
                        </Button>
                    ]}
                >
                    <this.Content >{this.renderContent()}</this.Content>
                </PageHeader>
                <PageHeader
                    className="site-page-header"
                    tags={<Tag color={this.state.tagColor}>{this.state.NFTState}</Tag>}
                    extra={[
                        <Button key="2" type="primary" disabled={this.state.buttonDisable} onClick={() => {
                            for(let key in this.state.owners){
                                alert("第"+key+"任拥有者"+this.state.owners[key]);
                            }
                        }}>
                        查看曾用有者    
                        </Button>
                    ]}
                >
                </PageHeader>
                
                <Modal
                    visible={this.state.modalVisible}
                    title="卖出"
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
                                this.SaleOut(values);
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
                            name="start"
                            label="起拍金额"
                            rules={[{ required: true, message: '必须填写金额!' }]}
                        >
                            <InputNumber  />
                        </Form.Item>
                        <Form.Item
                            name="duration"
                            label="持续时间/天"
                            rules={[{ required: true, message: '必须填写持续时间!' }]}
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


export default CardMyNFT