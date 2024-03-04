import { BI, hd, config, helpers, RPC, Indexer, commons } from '@ckb-lumos/lumos';
const mnemonic = hd.mnemonic;
const ExtendedPrivateKey = hd.ExtendedPrivateKey;

config.initializeConfig(config.predefined.AGGRON4);

const CKB_RPC_URL = "https://testnet.ckb.dev/rpc";
const CKB_INDEXER_URL = "https://testnet.ckb.dev/indexer";

const rpc = new RPC(CKB_RPC_URL);
const indexer = new Indexer(CKB_INDEXER_URL, CKB_RPC_URL);
// 生成私钥和地址


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
  const privateKey = "0x598366a7c3d61975eecb890251a3975deb8a7e74aeb303fd54379fbc6d67f5a1"
  const address = getAddressByPrivateKey(privateKey);
  console.log('privateKey: ', privateKey)
  console.log('address: ', address)  



 
  