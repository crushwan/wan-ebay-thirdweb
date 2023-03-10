import { useActiveListings, useContract, MediaRenderer } from "@thirdweb-dev/react";
import { ListingType } from "@thirdweb-dev/sdk";
import { BanknotesIcon, ClockIcon } from "@heroicons/react/24/outline";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";



const Home = () => {
  const { contract } = useContract(process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT, "marketplace");

  const { data: listings, isLoading: loadingListings } = useActiveListings(contract);
  
  return (
    <div className="bg-[#fefefe]">      

      <Header />

      <main className="max-w-6xl mx-auto px-2 py-6">
        {loadingListings ? (
          <div className="flex flex-col justify-center items-center gap-5">
            <div className="h-8 w-8 border-[3px] border-r-orange-500 rounded-full animate-spin"></div>
            <p className="text-center animate-pulse text-orange-500">Loading...</p>
          </div>
          
        ): (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
          gap-5 mx-auto">
            {listings?.map((listing) => (
              <Link 
                key={listing.id}
                href={`listing/${listing.id}`}
                className="flex flex-col card hover:scale-105 transition-all duration-150 ease-out bg-inherit"
                >
                <div>
                  <div className="flex-1 flex flex-col items-center pb-2 ">
                    <MediaRenderer className="w-44 rounded-xl" src={listing.asset.image} />
                  </div>

                  <div className="pt-2 space-y-4">
                    <div>
                      <h2 className="text-lg font-semibold truncate tracking-wide">{listing.asset.name}</h2>
                      <hr />
                      <p className="truncate text-[15px] text-gray-400 mt-2">{listing.asset.description}</p>
                    </div>
                  </div>

                  <p>
                    <span className="font-semibold mr-1">
                      {listing.buyoutCurrencyValuePerToken.displayValue}
                    </span>
                    <span className="text-gray-500">
                      {listing.buyoutCurrencyValuePerToken.symbol}
                    </span>
                  </p>

                  <div className={`flex items-center space-x-2 justify-end text-xs border w-fit ml-auto py-2 px-3 
                  rounded-lg text-white ${listing.type === ListingType.Direct ? "bg-blue-500" : "bg-red-500"}`}>
                    <p>
                      {listing.type === ListingType.Direct ? "Buy Now" : "Auction" }
                    </p>
                      {listing.type === ListingType.Direct ? (
                        <BanknotesIcon className="h-4" /> 
                        ): ( 
                        <ClockIcon className="h-4"/>
                      )}
                  </div>

                </div>
              </Link>
            ))}
          </div>
        )}

      </main>

      <Footer />

    </div>
  )
}

export default Home
