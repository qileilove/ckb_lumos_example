# 使用 ckb lumos 框架构建钱包
使用nodejs 与 es6 运行该项目，lumos推荐使用typescript.

## 生成钱包private key


`node get_private_key.js`


## 用生成钱包的address

将上步生成的key 替换到脚本中
`node get_wallet_address.js`


## 发送交易

`node test_transfer.js`

getCapacities()方法获取钱包余额.
transfer() 方法 发送交易。
