let menuInfo = {
  "AuthorityManage":{
  "icon":"el-icon-menu",
  "type":"multiple",
  "name":"权限管理",
  "submenu":{
          "GroupManage":{
              "name":"分组管理",
              "targetCom":"GroupManage",
          }
      }
},
  "ShopManage":{
  "icon":"el-icon-menu",
  "type":"single",
  "name":"商家管理",
  "targetCom":"ShopManage"
},
  "CategoryManage":{
  "icon":"el-icon-menu",
  "type":"single",
  "name":"分类管理",
  "targetCom":"CategoryManage"
},
  "ApplyManage":{
  "icon":"el-icon-menu",
  "type":"multiple",
  "name":"申请审核",
  "submenu":{
          "GoliveApplyManage":{
        "name":"商户上线申请",
        "targetCom":"GoliveApplyManage"
      },
          "ModifyApplyManage":{
        "name":"资料修改申请",
        "targetCom":"ModifyApplyManage"
      },
          "GoodsApplyManage":{
        "name":"商品上架申请",
        "targetCom":"GoodsApplyManage"
      }
      }
},
  "RechargeManage":{
  "icon":"el-icon-menu",
  "type":"multiple",
  "name":"充值管理",
  "submenu":{
          "RechargeItemManage":{
              "name":"充值金额设置",
              "targetCom":"RechargeItemManage"
          },
          "RechargeRecordManage":{
              "name":"充值记录",
              "targetCom":"RechargeRecordManage"
          }
      }
},
  "DataReport":{
  "icon":"el-icon-document",
  "type":"multiple",
  "name":"数据报表",
  "submenu":{
          "ShopDataReport":{
        "name":"商户数据",
        "targetCom":"ShopDataReport"
      }
      }
},
"ShopInfoManage":{
  "icon":"el-icon-menu",
  "type":"single",
  "name":"商家信息",
  "targetCom":"ShopInfoManage"
},
  "ShopVolumeReport":{
  "icon":"el-icon-menu",
  "type":"single",
  "name":"销量报表",
  "targetCom":"ShopVolumeReport"
},
  "GoodsManage":{
  "icon":"el-icon-menu",
  "type":"multiple",
  "name":"商品管理",
  "submenu":{
    "PromotionManage":{
      "name":"套餐管理",
      "targetCom":"PromotionManage"
    },
    "VoucherManage":{
      "name":"代金券管理",
      "targetCom":"PromotionManage"
    }
        }
  }
}

let createSubRouterInfo = () => {
  let routerInfo = [];
  Object.keys(menuInfo).forEach(function(key){
    if(menuInfo[key].type === 'single'){
      routerInfo.push({
        path:"/" + key,
        name:key,
        component: resolve => require(['./components/sub_page/' + key + '.vue'],resolve)
      })
    }else{
      Object.keys(menuInfo[key].submenu).forEach(function(subkey){
        routerInfo.push({
          path:"/" + subkey,
          name:subkey,
          component: resolve => require(['./components/sub_page/' + subkey + '.vue'],resolve)
        })
      })
    }
  });
  return routerInfo;
}

let authorityVerify = (authorityContent,targetCom) => {
  const authConStr = JSON.stringify(authorityContent);
  if(authConStr.match(targetCom) === null){
    return false;
  }else{
    return true
  }
}

let getCheckState = () => {
  let checkState = {}
  Object.keys(menuInfo).forEach((key)=>{
    if(menuInfo[key].type === "single"){
        checkState[key] = false;
    } else {
            checkState[key] = {};
            Object.keys(menuInfo[key].submenu).forEach((subkey)=>{
                checkState[key][subkey] = false;
            })
    }
  })
  return checkState;
}

export default{menuInfo , createSubRouterInfo , authorityVerify , getCheckState}