
/**
 * Triggers any configured deploy hooks after site generation
 */
export const triggerDeployHook = async (
  siteId: string
): Promise<{ success: boolean; message: string }> => {
  if (!process.env.NETLIFY_HOOK_URL) {
    console.warn('No deploy hook URL configured');
    return { success: false, message: 'No deploy hook URL configured' };
  }

  try {
    const deployResponse = await fetch(process.env.NETLIFY_HOOK_URL, { 
      method: 'POST',
      body: JSON.stringify({ site_id: siteId })
    });
    
    if (deployResponse.ok) {
      console.log('Deploy hook triggered successfully');
      return { success: true, message: 'Deploy hook triggered successfully' };
    } else {
      const errorText = await deployResponse.text();
      console.error('Error triggering deploy hook:', errorText);
      return { success: false, message: `Error triggering deploy hook: ${errorText}` };
    }
  } catch (deployError) {
    console.error('Failed to trigger deploy hook:', deployError);
    return { 
      success: false, 
      message: `Failed to trigger deploy hook: ${deployError instanceof Error ? deployError.message : String(deployError)}` 
    };
  }
};
