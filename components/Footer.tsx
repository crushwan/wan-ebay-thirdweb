import React from 'react'

type Props = {
  styles?: string,
}

function Footer({ styles }: Props) {
  return (
    <footer className={`${styles} bottom-0 max-w-7xl mx-auto`}>
      <div className="p-3 border-t-[1px] border-t-gray-300">

        <p className="font-poppins font-normal text-center text-[13px] leading-[20px] text-gray-600 tracking-wider">
          Copyright Ⓒ 2022 Wan. All Rights Reserved.
        </p>     
        
      </div>
    </footer>
  )
}

export default Footer