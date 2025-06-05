
export const validateClinicData = (clinicName: string, clinicEmail?: string) => {
  console.log('Validating clinic data:', { 
    clinicName: clinicName.trim(),
    clinicEmail: clinicEmail?.trim()
  });

  if (!clinicName.trim()) {
    console.log('❌ Empty clinic name provided');
    return {
      isValid: false,
      error: 'Please enter a clinic name.'
    };
  }

  if (clinicName.trim().length < 2) {
    console.log('❌ Clinic name too short');
    return {
      isValid: false,
      error: 'Clinic name must be at least 2 characters long.'
    };
  }

  if (clinicEmail && clinicEmail.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clinicEmail.trim())) {
      console.log('❌ Invalid email format');
      return {
        isValid: false,
        error: 'Please enter a valid email address.'
      };
    }
  }

  console.log('✅ Clinic data validation passed');
  return {
    isValid: true,
    error: null
  };
};
