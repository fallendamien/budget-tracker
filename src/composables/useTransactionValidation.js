import { useToast } from 'primevue/usetoast';

export function useTransactionValidation() {
  const toast = useToast();

  function validateTransaction(formData) {
    const errors = [];

    if (!formData.type) {
      errors.push('Type is required');
    }

    if (!formData.amount || formData.amount <= 0) {
      errors.push('Amount must be greater than 0');
    }

    if (!formData.category) {
      errors.push('Category is required');
    }

    if (!formData.date) {
      errors.push('Date is required');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  function showValidationError(errors) {
    toast.add({
      severity: 'error',
      summary: 'Validation Error',
      detail: errors.join(', '),
      life: 4000,
    });
  }

  function showSuccess(message = 'Transaction saved successfully') {
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: message,
      life: 3000,
    });
  }

  return {
    validateTransaction,
    showValidationError,
    showSuccess,
  };
}
