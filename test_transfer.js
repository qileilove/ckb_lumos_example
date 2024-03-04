import { BI, hd, config, helpers, RPC, Indexer, commons } from '@ckb-lumos/lumos';
const mnemonic = hd.mnemonic;
const ExtendedPrivateKey = hd.ExtendedPrivateKey;

config.initializeConfig(config.predefined.AGGRON4);

const CKB_RPC_URL = "https://testnet.ckb.dev/rpc";
const CKB_INDEXER_URL = "https://testnet.ckb.dev/indexer";

const rpc = new RPC(CKB_RPC_URL);
const indexer = new Indexer(CKB_INDEXER_URL, CKB_RPC_URL);

export const generateFirstHDPrivateKey = () => {
  const m = mnemonic.generateMnemonic();
  const seed = mnemonic.mnemonicToSeedSync(m);
  console.log('my mnemonic ', m);
  
  const extendedPrivKey = ExtendedPrivateKey.fromSeed(seed);
  return extendedPrivKey.privateKeyInfo(
    0, // Assuming this was meant to specify an index
  ).privateKey;
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
}

export async function getCapacities(address) {
  const collector = indexer.collector({
    lock: helpers.parseAddress(address),
  });

  let capacities = BI.from(0);
  for await (const cell of collector.collect()) {
    capacities = capacities.add(cell.cellOutput.capacity);
  }

  return capacities;
}

const transfer = async(from, to, capacity, privateKey) => {
  let txSkeleton = helpers.TransactionSkeleton({ cellProvider: indexer });
  txSkeleton = await commons.common.transfer(
    txSkeleton,
    [from],
    to,
    BI.from(capacity),
  );
  
  txSkeleton = await commons.common.payFeeByFeeRate(
    txSkeleton,
    [from],
    1000,
  );
  
  txSkeleton = commons.common.prepareSigningEntries(txSkeleton);
  const message = txSkeleton.get("signingEntries").get(0)?.message;
  const Sig = hd.key.signRecoverable(message, privateKey);
  const tx = helpers.sealTransaction(txSkeleton, [Sig]);

  return rpc.sendTransaction(tx, "passthrough");
}

// input your privateKey or generate a new privateKey
const privateKey = `0x37800c5cc550d629d4acb88ddc6a59dd99927f69cbd3b16e23979064d77b4788`;
const from_address = getAddressByPrivateKey(privateKey);
const to_address = 'ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqv8ranwaa6zldl3geuzlwq5rsegcjscw0s4hse3e'
console.log('address: ', from_address);
 getCapacities(from_address).then(capacities => console.log(`balance: ${capacities.toString()} CKB`));
 transfer(from_address, to_address, 100 * 10 ** 8, privateKey).then(txHash => console.log('txHash: ', txHash));

// let txSkeleton = helpers.TransactionSkeleton({ cellProvider: indexer });
// txSkeleton = await commons.common.transfer(
//     txSkeleton,
//     ['ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsq0y83qf0pu5f4u7m6q6yyr9pcx0ur38l4qdnakr8'],
//     'ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqv8ranwaa6zldl3geuzlwq5rsegcjscw0s4hse3e',
//     BI.from(10 * 10 ** 8),
// );


// txSkeleton = await commons.common.payFeeByFeeRate(
//   txSkeleton,
//   ['ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsq0y83qf0pu5f4u7m6q6yyr9pcx0ur38l4qdnakr8'],
//   1000,
// );



// txSkeleton = commons.common.prepareSigningEntries(txSkeleton);
// const message = txSkeleton.get("signingEntries").get(0)?.message;
// const Sig = hd.key.signRecoverable(message, privateKey);
// const tx = helpers.sealTransaction(txSkeleton, [Sig]);

// rpc.sendTransaction(tx, "passthrough").then(txHash => {
//   console.log(`txHash is: ${txHash}`);
// });
