# 十三行

本项目是个人开发的基于以太坊(Ethereum)和智能合约的Dapp项目，内容为NTF拍卖系统。

使用的技术栈是Typescript + React + Solidity



## 实现功能

本项目可以实现

1. 用户铸造NTF（未完成图片相关显示，仅为一个ID编码）

2. 用户把自己名义下的NTF进行放到市场拍卖
3. 用户到市场上进行拍卖
4. 用户能查看自己参与的拍卖项目
5. 用户对拍卖成功的项目进行付款，并完成NFT所有权的转移



## 使用步骤

1. 安装Node.js(以及yarn或npm)，以太坊ganache客户端，Chrome插件Metamask。

2. 使用Node.js安装truffle框架： 

   在控制台下输入`npm install truffle`进行安装

3. 打开ganache客户端，并连接到7545端口。

   在ganache软件上选择 quickstart，单击右上角齿轮图标进行设置。并在 workspace 标签页中 add project 选中 [./contracts/truffle-config.js](./contracts/truffle-config.js)，在server标签卡中将端口改为8545（metamask有一个localhost 8545的端口，比较方便运行测试）。单击右上角 save and restart完成设置。

4. 编译智能合约文件

   在 [./contracts](./public-offering/src/utils) 目录下按顺序运行：`truffle compile` 和 `truffle migrations`，将生成智能合约的地址（即下图的contract address复制到[contracts.ts](./public-offering/src/utils/contracts.ts)文件中的contractAddr变量，使得程序可以正确调用合约方法。

   <img src=".\img\p1.jpg" alt="p1" style="zoom:30%;" />

5. 安装依赖包

   在 [./public-offering](./public-offering) 目录下运行`npm i` 

6.  运行应用

   输入`npm start`在弹出的网页界面便可以进行操作
         

## 11月2日版本运行截图

这一版本主要实现了拍卖部分，但NFT仅限于自己上传名字和描述。

主页面

<img src=".\img\p2.jpg" alt="p2" style="zoom:30%;" />

铸造NFT

<img src=".\img\p3.jpg" alt="p3" style="zoom:30%;" />

开放拍卖

我的NFT中将会放置

<img src=".\img\p4.jpg" alt="p4" style="zoom:30%;" />

<img src=".\img\p5.jpg" alt="p5" style="zoom:30%;" />

切换账号

<img src=".\img\p6.jpg" alt="p6" style="zoom:50%;" />

竞拍

<img src=".\img\p7.jpg" alt="p7" style="zoom:30%;" />

提交后在我的拍卖中有显示

<img src=".\img\p8.jpg" alt="p8" style="zoom:30%;" />

截至时间到，支付订单

<img src=".\img\p10.jpg" alt="p10" style="zoom: 30%;" />

完成NFT所有权的转移和以太币的转移

<img src=".\img\p11.jpg" alt="p11" style="zoom: 30%;" />

<img src=".\img\p12.jpg" alt="p12" style="zoom:50%;" />





## 11月4日版本运行截图

在之前版本的基础上添加了一些额外功能，比如在铸造的时候生成一个随机的数字，这个数字会对应到这个NFT的一个属性值，图像上传花费了一定时间，但是由于本项目没有后端对上传的数据进行处理，因此图片部分由上述属性替代，。

修改部分展示

添加NFT属性

<img src=".\img\p15.jpg" style="zoom:30%;" />

添加查看曾拥有者的信息，会以弹窗的形式弹出第0任（即NFT铸造者）到现在的所有拥有者

<img src=".\img\p16.jpg" style="zoom:30%;" />



## 小结

对dapp的开发经历了好几个阶段，从前期准备时的solidity理论学习到前端书写以及对antd组件的应用，到后面不断修改思路，找因为现有问题而不能实现部份的代替方法，用了较多的时间，最后的成果虽然没有实现图片相关的内容，其余部分还是较为满意。
