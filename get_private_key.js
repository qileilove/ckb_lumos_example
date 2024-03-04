
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


  const getAddressByPrivateKey = (privateKey) => {
    const args = hd.key.privateKeyToBlake160(privateKey);
    const template = config.predefined.AGGRON4.SCRIPTS["SECP256K1_BLAKE160"];
    const lockScript = {
      codeHash: template.CODE_HASH,
      hashType: template.HASH_TYPE,
      args: args,
    };
  
    return helpers.encodeToAddress(lockScript);
  };
  const privateKey = generateFirstHDPrivateKey()
  const address = getAddressByPrivateKey(privateKey);
  console.log('privateKey: ', privateKey)
  console.log('address: ', address)  



 
  