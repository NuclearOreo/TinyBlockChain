const SHA256 = require('crypto-js/sha256');

class Block {
  constructor(index, timestamp, data, prevhash = ''){
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.prevhash = prevhash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash(){
    return SHA256(this.index + this.prevhash + JSON.stringify(this.data)+ this.nonce).toString();
  }

  mineBlock(diffuclty){
    while(this.hash.substring(0,diffuclty) !== Array(diffuclty + 1).join("0")){
      this.nonce++;
      this.hash = this.calculateHash();
    }

    console.log("Block Mined: " + this.hash);
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGensisBlock()];
    this.diffuclty = 5
  }

  createGensisBlock(){
    return new Block(0, "01/01/2017", "Genesis Block", "0")
  }

  getLatestBlock(){
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock){
    newBlock.prevhash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.diffuclty);
    this.chain.push(newBlock);
  }

  isChainValid(){
    for(let i = 1; this.chain.length; i++){
      const currentBlock = this.chain[i];
      const  prevBlock = this.chain[i-1];

      if(currentBlock.hash !== currentBlock.calculateHash()){
        return false;
      }

      if(currentBlock.prevhash !== prevBlock.hash){
        return false;
      }

      return true;
    }
  }
}

let savjeeCoin = new Blockchain();

console.log("Mining Block 1")
savjeeCoin.addBlock(new Block(1, "10/07/2017", {amount: 4}));

console.log("Mining Block 2")
savjeeCoin.addBlock(new Block(2, "12/07/2017", {amount: 10}));

console.log(JSON.stringify(savjeeCoin,null,4));

console.log();
console.log("Is Block Valid? " + savjeeCoin.isChainValid());
