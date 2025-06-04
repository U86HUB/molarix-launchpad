
import { GeneratedCopy, OnboardingSession } from '@/types/copy';

export class StreamingService {
  private abortController: AbortController | null = null;

  async processStreamingResponse(
    data: any,
    onContentUpdate: (content: string) => void,
    onSessionDataReceived: (sessionData: OnboardingSession) => void
  ): Promise<GeneratedCopy | null> {
    if (!(data instanceof ReadableStream)) {
      return null;
    }

    const reader = data.getReader();
    let accumulatedContent = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = new TextDecoder().decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const eventData = JSON.parse(line.slice(6));
            if (eventData.content) {
              accumulatedContent += eventData.content;
              onContentUpdate(accumulatedContent);
            }
            if (eventData.sessionData) {
              onSessionDataReceived(eventData.sessionData);
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }

    // Try to parse the final accumulated content as JSON
    try {
      return JSON.parse(accumulatedContent);
    } catch (parseError) {
      console.error('Failed to parse final copy:', parseError);
      return null;
    }
  }

  setAbortController(controller: AbortController) {
    this.abortController = controller;
  }

  abort() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }
}
