
export const validateClinicData = (clinicName: string) => {
  console.log('Validating clinic data:', { 
    clinicName: clinicName.trim()
  });

  if (!clinicName.trim()) {
    console.log('Empty clinic name provided');
    return {
      isValid: false,
      error: 'Please enter a clinic name.'
    };
  }

  return {
    isValid: true,
    error: null
  };
};
