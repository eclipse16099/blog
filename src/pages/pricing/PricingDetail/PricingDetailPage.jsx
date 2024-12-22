import React from 'react'
import MainLayout from "../../../components/MainLayout";

const PricingDetailPage = () => {
  return (
    <MainLayout>
      <section>
        <div className="flex flex-col justify-center items-center h-[100vh]">
          <div
            className="relative flex flex-col items-center rounded-[20px] w-[700px] max-w-[95%] mx-auto bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:!shadow-none p-3">
            <div className="mt-2 mb-8 w-full">
              <h4>
                General Information
              </h4>
              <p className="mt-2 px-2 text-base text-gray-600">
                At the moment, we can only manually process a subscription to the news for your account. However, automatic payment will be implemented soon. In the meantime, you can contact us on Telegram at @test_link_subscribe_news. Thank you for your interest in our news!
              </p>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}

export default PricingDetailPage;