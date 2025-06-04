
import { supabase } from '@/integrations/supabase/client';

export const getCurrentSession = async () => {
  console.log('Getting current session...');
  
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  
  console.log('Session data:', { 
    session: sessionData?.session ? {
      access_token: sessionData.session.access_token ? 'EXISTS' : 'MISSING',
      user_id: sessionData.session.user?.id,
      user_email: sessionData.session.user?.email,
      expires_at: sessionData.session.expires_at
    } : null,
    sessionError 
  });

  if (sessionError) {
    console.log('Error getting session:', sessionError);
    throw new Error('Session error: ' + sessionError.message);
  }

  if (!sessionData?.session) {
    console.log('No active session found');
    throw new Error('No active session. Please log in again.');
  }

  const session = sessionData.session;
  const userId = session.user?.id;

  if (!userId) {
    console.log('No user ID found in session');
    throw new Error('User ID not found in session');
  }

  console.log('Valid session found');
  return { session, userId };
};
