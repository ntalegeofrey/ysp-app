"use client";
import { useRouter } from "next/navigation";

export default function AccessDeniedPage() {
  const router = useRouter();

  const goHome = () => {
    try {
      const sel = localStorage.getItem('selectedProgram');
      if (sel) {
        router.push('/dashboard');
      } else {
        router.push('/program-selection');
      }
    } catch {
      router.push('/program-selection');
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white border border-bd rounded-xl shadow-sm p-8 text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-error/10 flex items-center justify-center">
          <i className="fa-solid fa-ban text-error text-2xl"></i>
        </div>
        <h1 className="text-2xl font-bold text-font-heading mb-2">Access Denied</h1>
        <p className="text-sm text-font-detail mb-6">
          You do not have permission to view this page. Please contact IT support if you believe this is a mistake.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button onClick={goHome} className="px-4 py-2 rounded-lg border hover:bg-bg-subtle">Go to Home</button>
          <a href="/support" className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-light">Contact IT Support</a>
        </div>
      </div>
    </div>
  );
}
