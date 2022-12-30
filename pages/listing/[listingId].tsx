import { useRouter } from "next/router";
import React, { useState, useEffect } from 'react';
import Header from "../../components/Header";
import {
    useNetwork,
    useNetworkMismatch,
    MediaRenderer,
    useContract,
    useListing,
    useMakeBid,
    useOffers,
    useMakeOffer,
    useBuyNow,
    useAddress,
    useAcceptDirectListingOffer
  } from "@thirdweb-dev/react";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { ListingType, NATIVE_TOKENS } from "@thirdweb-dev/sdk";
import Footer from "../../components/Footer";
import Countdown from "react-countdown";
import network from "../../utils/network";
import { ethers } from "ethers";
import toast, { Toaster } from "react-hot-toast";

type Props = {}

function ListingPage({}: Props) {
  const router = useRouter();
  const address = useAddress();
  const [processingBuy, setProcessingBuy] = useState(false);
  const [processingOffer, setProcessingOffer] = useState(false);
  const { listingId } = router.query as { listingId: string };
  const [bidAmount, setBidAmount] = useState("");
  const [, switchNetwork ] = useNetwork();
  const networkMismatch = useNetworkMismatch();

  const [minimumNextBid, setminimumNextBid] = useState<{
    displayValue: string;
    symbol: string;
  }>();

  const { contract } = useContract(process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT, 'marketplace');

  const { mutate: makeBid } = useMakeBid(contract);

  const { data: offers } = useOffers(contract, listingId);

  const { mutate: buyNow } = useBuyNow(contract);

  const { mutate: makeOffer } = useMakeOffer(contract);

  const { data: listing, isLoading, error } = useListing(contract, listingId);

  const { mutate: acceptOffer } = useAcceptDirectListingOffer(contract);
  
  

  useEffect(() => {
    if (!listingId || !contract || !listing) return;

    if (listing.type === ListingType.Auction) {
      fetchMinNextBid()
    }
      
  }, [listingId, listing, contract]);

 
  const fetchMinNextBid = async () => {
    if (!listingId || !contract ) return;

    const { displayValue, symbol }= await contract.auction.getMinimumNextBid(listingId);

    setminimumNextBid({
      displayValue: displayValue,
      symbol: symbol,
    })
  }
  

  const formatPlaceholder = () => {
    if(!listing) return;

    if(listing.type === ListingType.Direct) {
      return 'Enter Offer Amount';
    } else if (listing.type === ListingType.Auction) {
      return Number(minimumNextBid?.displayValue) === 0
      ? 'Enter Bid Amount'
      : `${minimumNextBid?.displayValue} ${minimumNextBid?.symbol} or more`;
    }

  }

  const buyNft = async () => {
    setProcessingBuy(true);
    if (networkMismatch) {
      switchNetwork && switchNetwork(network);
      setProcessingBuy(false);
      setProcessingOffer(false);
      return;
    }

    if (!listingId || !contract || !listing) {
      setProcessingBuy(false);
      setProcessingOffer(false);
      return;
    }

    await buyNow({
      id: listingId,
      buyAmount: 1,
      type: listing.type,
    }, {
      onSuccess(data, variables, context) {
        setProcessingBuy(false);
        setProcessingOffer(false);
        toast.success("NFT bought successfully");
        // console.log('SUCCESS', data);
        router.replace('/');
      },
      onError(error, variables, context) {
        setProcessingBuy(false);
        setProcessingOffer(false);
        toast.error("Error buying NFT");
        // console.log('ERROR: ', error);
      }
    })
  };

  const createBidOrOffer = async () => {
    setProcessingOffer(true);
    try {
      if (networkMismatch) {
        switchNetwork && switchNetwork(network);
        setProcessingOffer(false);
        return;
      }

      // Direct
      if (listing?.type === ListingType.Direct){
        if (listing.buyoutPrice.toString() === ethers.utils.parseEther(bidAmount).toString()) {
          // console.log("Buyout Price met, buying NFT");

          buyNft();
          return;
        }

        // console.log("Buyout Price not met, making offer");
        await makeOffer({
          quantity: 1,
          listingId,
          pricePerToken: bidAmount,        
        },{
          onSuccess(data, variables, context) {
            setProcessingOffer(false);
            toast.success("Offer made successfully");
            // console.log('SUCCESS', data);
            setBidAmount("");
          },
          onError(error, variables, context) {
            setProcessingOffer(false);
            toast.success("Offer could not be made");
            // console.log('ERROR: ', error);
          },
        })
      }

      // Auction
      if (listing?.type === ListingType.Auction) {
        // console.log("Making Bid...")

        await makeBid({
          listingId,
          bid: bidAmount,
        },{
          onSuccess(data, variables, context) {
            setProcessingOffer(false);
            toast.success("Bid made successfully");
            // console.log('SUCCESS', data);
            setBidAmount('');
          },
          onError(error, variables, context) {
            setProcessingOffer(false);
            toast.success("Bid could not be made");
            // console.log('ERROR', error);    
          },
          
        })
      }

    } catch (error) {
      setProcessingOffer(false);
      // console.error(error);
    }

  }

  if (isLoading) 
    return (
      <div>
        <Header />

        <div className="flex flex-col justify-center items-center gap-5">
          <div className="h-8 w-8 border-[3px] border-r-orange-500 rounded-full animate-spin"></div>
          <p className="text-center animate-pulse text-orange-500">Loading...</p>
        </div>
      </div>
    )

  if (!listing) {
    return <div>Listing not found</div>
  }

  
  return (
    <div>
      <Header />

      <main className="max-w-6xl mx-auto p-2 flex flex-col lg:flex-row
      space-y-10 space-x-5 pr-10">
        <div className="p-10 border mx-auto lg:mx-0 max-w-md lg:max-w-xl">
          <MediaRenderer src={listing.asset.image} />
        </div>

        <section className="flex-1 space-y-5 pb-20 lg:pb-0">
          <div>
            <h1 className="text-xl font-bold">{listing.asset.name}</h1>
            <p className="text-gray-500">{listing.asset.description}</p>
            <p className="flex items-center text-xs sm:text-base">
              <UserCircleIcon className="h-5" />
              <span className="font-semibold px-1">Seller:</span>
              <span className="text-gray-500">{listing.sellerAddress}</span>
            </p>
          </div>

          <div className="grid grid-cols-2 items-center py-2">
            <p className="font-bold">Listing Type:</p>
            <p>
              {listing.type === ListingType.Direct 
              ? 'Direct Listing'
              : 'Auction Listing' }
            </p>

            <p className="font-bold">Buy it Now Price:</p>
            <p className="text-4xl font-bold">
              {listing.buyoutCurrencyValuePerToken.displayValue}{" "}
              {listing.buyoutCurrencyValuePerToken.symbol}
            </p>

            <button onClick={buyNft} className={`col-start-2 mt-2 bg-blue-500 font-bold
            text-white rounded-full w-44 py-4 px-10 ${
              processingBuy ? "disabled" : ""
            }`}>
              {processingBuy ? "Processing..." : "Buy Now"}
            </button>
          </div>

          {listing.type === ListingType.Direct && offers && (
            <div className="grid grid-cols-2 gap-y-2">
              <p className="font-semibold">Offers: </p>
              <p className="font-semibold">{offers.length > 0 ? offers.length : 0 }</p>

              {offers.map((offer) => (
                <>
                  <p className="flex items-center ml-5 text-sm italic">
                    <UserCircleIcon className="h-3 mr-2" />
                    {offer.offeror.slice(0,5) + "..." + offer.offeror.slice(-5)}
                  </p>
                  <div>
                    <p 
                      key={
                        offer.listingId +
                        offer.offeror +
                        offer.totalOfferAmount.toString()
                      }
                      className="text-sm italic"
                    >
                      {ethers.utils.formatEther(offer.totalOfferAmount)}{" "}
                        {NATIVE_TOKENS[network].symbol}
                    </p>

                    {listing.sellerAddress === address &&  (
                      <button
                        onClick={() => {
                          setProcessingBuy(true);
                          acceptOffer({
                            listingId,
                            addressOfOfferor: offer.offeror,
                          }, {
                            onSuccess(data, variables, context) {
                              setProcessingBuy(false);
                              toast.success("Accepted successfully!");
                              // console.log("SUCCESS",data);

                              router.replace('/')
                            }, 
                            onError(error, variables, context) {
                              setProcessingBuy(false);
                              toast.error("Error accepting offer");
                              // console.log("ERROR",error);
                            },
                          })
                        }}
                        className="p-2 w-32 bg-red-500/80 rounded-lg font-semibold text-xs cursor-pointer"
                      >
                        Accept Offer
                      </button>
                    )}
                  </div>
                </>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 space-y-2 items-center
          justify-end">
            <hr className="col-span-2"/>

            <p className="col-span-2 font-bold">
              {listing.type === ListingType.Direct ? 'Make an Offer' : 'Bid on this Auction'}
            </p>

            {listing.type === ListingType.Auction && 
              <>
                <p>Current Minimum Bid:</p>
                <p className="font-semibold">{minimumNextBid?.displayValue} {minimumNextBid?.symbol}</p>

                <p>Time Remaining:</p>
                <Countdown 
                  date={Number(listing.endTimeInEpochSeconds.toString()) * 1000}
                />
              </>
            }

            <input 
              className="border p-2 rounded-lg mr-5"
              type="text" 
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder={formatPlaceholder()}
            />
            {/* <button onClick={createBidOrOffer} className="bg-red-500 font-bold text-white
            rounded-full w-44 py-4 px-10">
              {listing.type === ListingType.Direct ? 'Offer' : 'Bid'}
            </button> */}
            <button
              onClick={createBidOrOffer}
              className={`bg-red-600 font-bold text-white rounded-full w-44 py-4 px-10 ${
                processingOffer ? "disabled" : ""
              }`}
            >
              {processingOffer
                ? "Processing..."
                : listing?.type === ListingType.Direct
                ? "Offer"
                : "Bid"}
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default ListingPage