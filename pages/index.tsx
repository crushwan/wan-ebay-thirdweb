import { useActiveListings, useContract, MediaRenderer } from "@thirdweb-dev/react";
import { ListingType } from "@thirdweb-dev/sdk";
import { BanknotesIcon, ClockIcon } from "@heroicons/react/24/outline";
import Header from "../components/Header";



const Home = () => {
  const { contract } = useContract(process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT, "marketplace");

  const { data: listings, isLoading: loadingListings } = useActiveListings(contract);
  
  return (
    <div>      

      <Header />

      <main className="max-w-6xl mx-auto px-2 py-6">
        {loadingListings ? (
          <p className="text-center animate-pulse text-orange-500">Loading listings...</p>
        ): (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
          gap-5 mx-auto">
            {listings?.map((listing) => (
              <div
                key={listing.id}
                className="flex flex-col card hover:scale-105 transition-all duration-150 ease-out"
              >
                <div className="flex-1 flex flex-col items-center pb-2 ">
                  <MediaRenderer className="w-44 rounded-xl" src={listing.asset.image} />
                </div>

                <div className="pt-2 space-y-4">
                  <div>
                    <h2 className="text-lg font-semibold truncate tracking-widest">{listing.asset.name}</h2>
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
            ))}
          </div>
        )}

      </main>

    </div>
  )
}

export default Home
