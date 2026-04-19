export default function ForgotPasswordLoading() {
  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 py-6"
      style={{ background: 'linear-gradient(160deg, #f0f4ff 0%, #e8f5ee 60%, #dff0e8 100%)' }}
    >
      <div className="w-full max-w-[390px]">
        <div className="h-16 mb-8 bg-[#f0f0f5] rounded-xl animate-pulse" />
        
        <div className="bg-white rounded-3xl p-8 sm:p-10 w-full shadow-[0_2px_24px_rgba(0,0,0,0.06)]">
          <div className="mb-8">
            <div className="h-8 w-48 bg-[#f0f0f5] rounded-lg mb-3 animate-pulse" />
            <div className="h-4 w-full bg-[#f0f0f5] rounded-lg animate-pulse" />
          </div>

          <div className="space-y-6">
            <div>
              <div className="h-4 w-20 bg-[#f0f0f5] rounded-lg mb-2 animate-pulse" />
              <div className="h-12 w-full bg-[#f0f0f5] rounded-xl animate-pulse" />
            </div>
            <div className="h-12 w-full bg-[#f0f0f5] rounded-xl animate-pulse" />
          </div>

          <div className="mt-8 pt-6 border-t-[1.5px] border-[#f0f0f5]">
            <div className="h-4 w-full bg-[#f0f0f5] rounded-lg animate-pulse" />
          </div>
        </div>

        <div className="mt-6 text-center">
          <div className="h-3 w-48 bg-[#f0f0f5] rounded-lg mx-auto animate-pulse" />
        </div>
      </div>
    </div>
  );
}
