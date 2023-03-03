import React from 'react'

const Data =  {
    tokenId,
    seller,
    owner,
    price,
  }

  const fetchContract = (signerOrProvider) =>
  new ethers.Contract(
    NFTMarketplaceAddress,
    NFTMarketplaceABI,
    signerOrProvider
  );
  
const fetchNFTs = async ( ) => {
    try {
      const provider = new ethers.providers.JsonRpcProvider();
      const contract = fetchContract(provider);
      const data = await contract.fetchMarketItems();
      console.log("checking nft --> ", data);

      const dataPromiseArr = data.map(
        async ({ tokenId, seller, owner, price: unformattedPrice } ) => {
          const tokenURI = await contract.tokenURI(tokenId);
          const {
            data: { image, name, description, collection, category},
          } = await axios.get(tokenURI);
          const price = ethers.utils.formatUnits(
            unformattedPrice.toString(),
            "ether"
          );

          return {
            price, 
            tokenId: tokenId.toNumber(),
            seller,
            owner,
            image,
            name,
            description,
            tokenURI,
            category,
            collection
          };
        }
      );
      const items = await Promise.allSettled(dataPromiseArr);
      const results = items
        .filter((item) => item.status === "fulfilled")
        .map((item) => item.value);
      return results;
    } catch (error) {
      console.log("Error while fetching nft's", error);
    }
};


const BackendFunctions = () => {
  return 
  (
    <div>BackendFunctions</div>
  )
}


export default BackendFunctions