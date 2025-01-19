import { useState } from "react";

export const useFormStatus = () => {
  const [status, setStatus] = useState('idle');

  const startPending = () => setStatus('pending');
  const setSuccess = () => setStatus('success');
  const setError = () => setStatus('error');
  const resetStatus = () => setStatus('idle');

  return { status, startPending, setSuccess, setError, resetStatus };
};