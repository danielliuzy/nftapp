const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Get the contract factory
  const MyNFT = await hre.ethers.getContractFactory("NFTM");

  console.log("Deploying NFT...");

  // Deploy the contract
  const nft = await MyNFT.deploy();

  // Wait for the contract to be deployed
  await nft.waitForDeployment();

  console.log("NFT deployed to:", nft.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
