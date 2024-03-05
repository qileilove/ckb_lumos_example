
import { initializeConfig, predefined }  from '@ckb-lumos/config-manager';
import { hd, config, helpers } from '@ckb-lumos/lumos';
const { mnemonic, ExtendedPrivateKey,AddressType } = hd;
// 初始化Lumos配置
initializeConfig(predefined.LINA);

// 生成私钥和地址
export const generateFirstHDPrivateKey = () => {
    const myMnemonic = mnemonic.generateMnemonic();
    const seed = mnemonic.mnemonicToSeedSync(myMnemonic);
    console.log("my mnemonic ", seed);
  
    const extendedPrivKey = ExtendedPrivateKey.fromSeed(seed);
    return extendedPrivKey.privateKeyInfo(AddressType.Receiving, 0).privateKey;
  }

  const privateKey = generateFirstHDPrivateKey()
  console.log('privateKey: ', privateKey)



 
  