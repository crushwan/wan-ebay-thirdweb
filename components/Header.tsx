import React from 'react';
import { useAddress, useDisconnect, useMetamask } from "@thirdweb-dev/react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDownIcon, BellIcon, ShoppingBagIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

type Props = {}

function Header({}: Props) {
  const connectWithMetamask = useMetamask();
  const disconnect = useDisconnect();
  const address = useAddress();

  return (
    <div className="max-w-7xl mx-auto p-2">
      <nav className="flex justify-between">

        <div className="flex items-center space-x-2 text-sm">
          {address ? (
            <button onClick={disconnect} className="connectWalletBtn">
              Hi, {`${address.slice(0,5)}...${address.slice(-4)}`}
            </button>
          ): (
            <button onClick={connectWithMetamask} className="connectWalletBtn">
              Connect your wallet
            </button>
          )}

          <p className="headerLink">Daily Deals</p>
          <p className="headerLink">Help & Contact</p>
        </div>

        <div className="flex items-center space-x-4 text-sm">
          <p className="headerLink">Ship to</p>
          <p className="headerLink">Sell</p>
          <p className="headerLink">Watchlist</p>

          <Link href="/addItem" className="flex items-center link font-semibold">
            Add to inventory
            <ChevronDownIcon className="h-4"/>
          </Link>

          <BellIcon className="h-5 w-5 text-gray-500 link" />
          <ShoppingBagIcon className="h-5 w-5 text-gray-500 link" />

        </div>

      </nav>

      <hr className="mt-2" />

      <section className="flex items-center space-x-2 py-5">
        <div className="h-16 w-16 sm:w-28 md:w-44 cursor-pointer flex-shrink-0">
          <Link href="/">
            <Image
              className="h-full w-full object-contain md:px-5"
              alt="Thirdweb Logo"
              src="/lalala.png"
              width={100}
              height={100}
            />
          </Link>
        </div>

        <button className="hidden lg:flex items-center space-x-2 w-20">
          <p className="text-gray-600 text-sm leading-4">Shop by Category</p>
          <ChevronDownIcon className="h-4 flex-shrink-0" />
        </button>

        <div className="flex items-center space-x-2 px-2 md:px-5 py-2 border-2 border-gray-500 flex-1 rounded-[3px]">
          <MagnifyingGlassIcon className="w-5 text-gray-400" />
          <input
            className="flex-1 outline-none bg-inherit"
            placeholder="Searh for Anything"
            type="text"
          />
        </div>

        <button className="hidden sm:inline bg-orange-600 text-white px-4
        md:px-8 py-2 border-2 border-orange-600 rounded-[3px] font-medium">
          Search
        </button>
        
        <Link href="/create">
          <button className="px-4 md:px-8 py-2 text-orange-600 hover:underline cursor-pointer font-medium">
            List{" "}
            <span className="hidden md:inline">Item</span>
          </button>
        </Link>
      </section>

      <hr />

      <section className="flex py-3 space-x-6 text-xs md:text-sm
      whitespace-nowrap justify-center px-6">
        <p className="link">Home</p>
        <p className="link">Electronic</p>
        <p className="link">Computers</p>
        <p className="link hidden sm:inline">Video Games</p>
        <p className="link hidden sm:inline">Home & Garden</p>
        <p className="link hidden md:inline">Health & Beauty</p>
        <p className="link hidden lg:inline">Collectibles & Art</p>
        <p className="link hidden lg:inline">Books</p>
        <p className="link hidden lg:inline">Music</p>
        <p className="link hidden xl:inline">Deals</p>
        <p className="link hidden xl:inline">Other</p>
        <p className="link">More</p>
      </section>
      
    </div>
  )
}

export default Header