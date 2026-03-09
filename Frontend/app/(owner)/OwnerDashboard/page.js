import OwnerDashboard from '@components/owner/component/OwnerDashboard'
import Header from '@components/user/layout/Header'

const page = () => {
  return (
    <div>

      <div className='w-full h-full'>
        <div className='w-full flex flex-col justify-center items-center shadow-2xl sticky top-0 z-10 bg-white'>
          <div className='w-10/12'>
            <Header />
          </div>
        </div>
        <OwnerDashboard />
      </div>

    </div>
  )
}

export default page
