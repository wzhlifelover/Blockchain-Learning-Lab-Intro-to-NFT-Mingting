// Right click on the script name and hit 'Run' to execute
(async () => {
    try {

        ////////////////// PLEASE FILL IN THE VARIABLES HERE////////////
        const TokenId = 20;  //Input your token id here
        const contract_address = 'YOUR_DEPLOYED_CONTRACT_ADDRESS'; //Your Deployed Contract Address
        ///////////////////////////////////////////////////////////////
        
        const totalNfts = 1; // Total number of NFTs in your collection
        
        console.log('Running `mint_one_nft` script...');

        const contractName = 'KisSIIMmee'; // Change for other contracts
        

        // Note that the script needs the ABI which is generated from the compilation artifact.
        // Make sure contract is compiled and artifacts are generated
        const artifactsPath = `browser/contracts/artifacts/${contractName}.json`; // Change this for different path

        const metadata = JSON.parse(
            await remix.call('fileManager', 'getFile', artifactsPath)
        );
        const accounts = await web3.eth.getAccounts();

        const KisSIIMmee = new web3.eth.Contract(
            metadata.abi,
            contract_address,
            {
                from: accounts[0]
            }
        );

        // NFTs to mint in each transaction -- only one in this example
        const mintSize = 1;
        
        if (mintSize === 0) {
            throw new Error(
                'Please specify greater than zero value for mintSize'
            );
        }
        let currentMintSize = 1;

        // Array containing tokenIds
        const ids = getTokenIds(TokenId, currentMintSize);
        // Array containing amount to mint for each tokenId, 1 in case of NFT's
        const amounts = getAmounts(currentMintSize);
        console.log('Token Ids to be minted in current batch => ', ids);
        console.log(
            'Amounts to be minted for each Token Id in current batch => ',
            amounts
        );
        await KisSIIMmee.methods
            .mintBatch(ids, amounts)
            .send({ from: accounts[0] });
        console.log('successfully batch minted NFTs for current batch');
        

        // https://docs.openzeppelin.com/contracts/2.x/api/token/erc721#IERC721-balanceOf-address-
        // Returns number of NFTs in owner's account for tokenID 1
        const balance = await KisSIIMmee.methods
            .balanceOf(accounts[0], 1)
            .call();
        console.log('balance: ', balance);
    } catch (e) {
        console.log(e.message);
    }
})();

function getTokenIds(startTokenId, size) {
    return Array(size)
        .fill()
        .map((element, index) => index + startTokenId);
}

function getAmounts(size) {
    return Array(size).fill(1);
}
