import React, { FormEvent, useState } from 'react';
import Header from "../components/Header";
import { useAddress, useContract } from "@thirdweb-dev/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import Footer from "../components/Footer";

type Props = {}

function addItem({}: Props) {
  const address = useAddress()
  const router = useRouter()
  const [preview, setPreview] = useState<string>()
  const [image, setImage] = useState<File>()

  const { contract } = useContract(process.env.NEXT_PUBLIC_COLLECTION_CONTRACT, 'nft-collection');

  const mintNft = async (e: FormEvent<HTMLFormElement> ) => {
    e.preventDefault();

    if (!contract || !address) return;

    if (!image) {
      alert('Please select an image');
      return;
    }

    const target = e.target as typeof e.target & {
      name: { value: string };
      description: { value: string };
    }

    const metadata = {
      name: target.name.value,
      description: target.description.value,
      image: image,
    }

    try {
      const tx = await contract.mintTo(address, metadata);

      const receipt = tx.receipt;
      const tokenId = tx.id;
      const nft = await tx.data();

      console.log(receipt,tokenId,nft);

      router.push("/");

    } catch (error) {
      console.error(error)
    }

  };

  return (
    <div>
      <Header />

      <main className="max-w-6xl mx-auto p-10 border">
        <h1 className="text-4xl font-bold">Add an Item to the Marketplace</h1>
        <h2 className="text-xl font-semibold pt-5">Item Details</h2>
        <p className="pb-5">
          By adding an item to the Marketplace, you're
          essentially Minting an NFT of the item into 
          your wallent which we can then list for sale!
        </p>

        <div className="flex flex-col justify-center items-center md:flex-row md:space-x-5 pt-5">
          <img
            className="border h-80 w-80 object-contain p-2"
            src={preview || "vercel.svg"}
            alt="Preview"
          />
          
          <form onSubmit={mintNft} className="flex flex-col flex-1 p-2 gap-y-2">
            <label className="font-light">Name of Item</label>
            <input
              className="formField"
              placeholder="Name of Item"
              type="text"
              name="name"
              id="name"
            />

            <label className="font-light">Description</label>
            <input
              className="formField"
              placeholder="Enter Description"
              type="text"
              name="description"
              id="description"
            />

            <label className="font-light">Image of the Item</label>
            <input type="file" onChange={e => {
              if(e.target.files?.[0]){
                setPreview(URL.createObjectURL(e.target.files[0]));
                setImage(e.target.files[0]);
              }
              }}
            />
            
            <button type="submit" className="flex justify-center items-center space-x-2 bg-orange-600
             font-semibold text-white rounded-lg mt-10 md:mt-5 xs:mx-auto py-3 px-7 md:ml-auto">
              <PlusIcon className="h-4 w-4" />
              <span>Mint Item</span>
            </button>
          </form>
          
          

        </div>

      </main>

      <Footer styles={`mt-10`} />

    </div>
  )
}

export default addItem