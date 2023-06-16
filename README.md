# Compile
npx hardhat compile

# Deploy 
npx hardhat run --network scrolltest(localhsot) ./script/depoly.js

# Deploy zkSync
yarn hardhat deploy-zksync --script ./deploy/deploy_zks.js

# Test
## test crosscontroller
npx hardhat test ./test/CrossController.test.js

## test zkBridge
tsc ./test/zkbridge.test.ts   
npx hardhat test ./test/zkbridge.test.js