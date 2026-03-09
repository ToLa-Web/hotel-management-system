import LoginForm from '@components/Authentication/LoginForm'
import React from 'react'

const page = () => {
  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#0f0d0aba]">
      {/* Background image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/djbtemkl1/image/upload/v1772801512/pexels-photo-258154_cfatrw.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />
      <LoginForm />
    </div>
  )
}

export default page