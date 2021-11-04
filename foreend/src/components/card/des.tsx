import React,{Component} from 'react'
const a0=["的刺猬","的猫","的狗","的猪","的鸡","的兔子","的老鼠","的牛","的羊","的蛇"];
const a1=["红眼睛","橙眼睛","黄眼睛","绿眼睛","青眼睛","蓝眼睛","紫眼睛","黑眼睛","白眼睛","灰眼睛"];
const a2=["红鼻子","橙鼻子","黄鼻子","绿鼻子","青鼻子","蓝鼻子","紫鼻子","黑鼻子","白鼻子","灰鼻子"];
const a3=["红耳朵","橙耳朵","黄耳朵","绿耳朵","青耳朵","蓝耳朵","紫耳朵","黑耳朵","白耳朵","灰耳朵"];
const a4=["红嘴巴","橙嘴巴","黄嘴巴","绿嘴巴","青嘴巴","蓝嘴巴","紫嘴巴","黑嘴巴","白嘴巴","灰嘴巴"];

interface IProps{
    nft:any
}
function getInfo (values:any){
    let len= 0
    let temp = values
    let des = ""
    while (temp>0){
        temp = temp / 10;
        len++;
    }
    temp = values
    while (temp>0){
        len--;
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
        temp /=10;
    }
    return des;
}
class descript {
    state = {
        des:""
    }
    
}

export default descript