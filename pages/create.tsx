import React, { FormEvent, useState }from 'react';
import Header from "../components/Header";
import { 
  useAddress,
   useContract,
   MediaRenderer,
   useNetwork,
   useNetworkMismatch,
   useOwnedNFTs,
   useCreateAuctionListing,
   useCreateDirectListing
   } from "@thirdweb-dev/react";
import { NATIVE_TOKEN_ADDRESS, NFT } from "@thirdweb-dev/sdk";
import network from "../utils/network";
import { useRouter } from "next/router";
import Footer from "../components/Footer";
import toast, { Toaster } from "react-hot-toast";

type Props = {}

function Create({}: Props) {
  const address = useAddress();
  const router = useRouter()
  const { contract } = useContract(process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT, 'marketplace');

  const [selectedNft, setSelectedNft] = useState<NFT>();

  const { contract: collectionContract } = useContract(process.env.NEXT_PUBLIC_COLLECTION_CONTRACT, 'nft-collection');

  const ownedNfts = useOwnedNFTs(collectionContract, address);

  const networkMismatch = useNetworkMismatch();
  const [,switchNetwork] = useNetwork();

  const {
    mutate: createDirectListing,
    isLoading,
    error,
  } = useCreateDirectListing(contract);

  const {
    mutate: createAuctionListing,
    isLoading: isAuctionLoading,
    error: auctionError,
  } = useCreateAuctionListing(contract);

  const handleCreateListing = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(networkMismatch) {
      switchNetwork && switchNetwork(network);
      return;
    }

    if(!selectedNft) return;

    const target = e.target as typeof e.target & {
      elements: { listingType: { value: string }, price: { value: string } }
    };

    const { listingType, price } = target.elements;

    if(listingType.value === 'directListing') {
      toast("Creating listing...", {
        icon: "⌛",
      });

      createDirectListing({
        assetContractAddress: process.env.NEXT_PUBLIC_COLLECTION_CONTRACT!,
        tokenId: selectedNft.metadata.id,
        currencyContractAddress: NATIVE_TOKEN_ADDRESS,
        listingDurationInSeconds: 60 * 60 * 24 * 7 * 8,
        quantity: 1,
        buyoutPricePerToken: price.value,
        startTimestamp: new Date(),
    }, {
      onSuccess(data, variables, context) {
        toast.success("Successfully Listed!");
        router.push('/');
        },
        onError(error, variables, context) {
          toast.error("Could not list. Try again later.");
          },
        }
      );
    };

    if(listingType.value === 'auctionListing') {
      toast("Creating auction...", {
        icon: "⌛",
      });

      createAuctionListing({
        assetContractAddress: process.env.NEXT_PUBLIC_COLLECTION_CONTRACT!,
        tokenId: selectedNft.metadata.id,
        currencyContractAddress: NATIVE_TOKEN_ADDRESS,
        listingDurationInSeconds: 60 * 60 * 24 * 30 * 2,
        quantity: 1,
        buyoutPricePerToken: price.value,
        startTimestamp: new Date(),
        reservePricePerToken: 0,
      }, {
        onSuccess(data, variables, context) {
          toast.success("Successfully Listed the Auction!");
          router.push('/');
        }, 
        onError(error, variables, context) {
          toast.error("Could not list. Try again later.");
          // console.log('Error: ',error, variables, context);
        },
      })
    };

  };

  
  return (
    <div  className="min-h-screen">
      
      <Header />
      
      <main className="max-w-6xl mx-auto p-10 pt-2 space-y-10">
        <h1 className="text-4xl font-bold">List an Item</h1>
        <h2 className="text-xl font-semibold pt-5">Select an Item you would like to Sell</h2>

        <hr className="mb-4" />

        <p>Below you will find the NFT's you own in your wallet</p>

        <div className="flex overflow-x-scroll space-x-2 p-4">
          {ownedNfts?.data?.map((nft) => (
            <div
              className={`flex flex-col space-y-2 card min-w-fit border-2
              ${nft.metadata.id === selectedNft?.metadata.id ? 'border-orange-500' : 'border-transparent'}`}
              key={nft.metadata.id}
              onClick={() => setSelectedNft(nft)}
            >
              <MediaRenderer 
                className="h-48 rounded-lg"
                src={nft.metadata.image} 
              />
              <p className="text-lg truncate font-bold">{nft.metadata.name}</p>
              <p className="text-xs truncate">{nft.metadata.description}</p>

            </div>
          ))}
        </div>

        {selectedNft && (
              <form onSubmit={handleCreateListing}>
                <div className="flex flex-col p-10 rounded-md border-[1px] border-gray-400">
                  <div className="grid grid-cols-2 gap-5">
                    <label className="font-light">Direct Listing</label>
                    <input type="radio" name="listingType"
                      value="directListing" 
                      className="ml-auto h-6 w-6"/>

                    <label className="font-light">Auction</label>
                    <input type="radio" name="listingType"
                      value="auctionListing" ml-auto h-10 w-10
                      className="ml-auto h-6 w-6"/>

                    <label className="font-light">Price</label>
                    <input
                      type="text"
                      name="price"
                      placeholder="0.003"
                      className="bg-gray-50 p-5 text-right rounded-md"
                    />
                  </div>

                  <button className="font-semibold bg-orange-600 text-white rounded-lg p-3 mt-8" type="submit">
                    Create Listing
                  </button>

                </div>
              </form>
            )}
      </main>
      
      <Footer/>
            
    </div>
  )
}

export default Create