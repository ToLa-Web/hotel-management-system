import SignUpForm from '@components/Authentication/SignUpForm'
import React from 'react'

const page = () => {
  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#0f0d0abe]">
      {/* Background image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/djbtemkl1/image/upload/v1772801947/wp8815354-4k-hotel-wallpapers_zqoxpq.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />
      <SignUpForm />
    </div>
  )
}

export default page