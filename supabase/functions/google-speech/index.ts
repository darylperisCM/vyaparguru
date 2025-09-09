import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const action = url.searchParams.get('action') || 'synthesize'
    const body = await req.json()

    console.log(`Google Speech API - Action: ${action}`, { body })

    const apiKey = Deno.env.get('GOOGLE_CLOUD_API_KEY')
    if (!apiKey) {
      throw new Error('GOOGLE_CLOUD_API_KEY is not configured')
    }

    if (action === 'transcribe') {
      // Speech-to-Text
      const { audioData, language = 'hi-IN', container = 'webm' } = body
      if (!audioData) throw new Error('audioData required')

      // Accept data URLs or raw base64
      const base64 = audioData.includes(',') ? audioData.split(',')[1] : audioData

      // Map container to encoding
      const encoding = container.includes('ogg') ? 'OGG_OPUS' : 'WEBM_OPUS'

      const requestBody = {
        config: {
          encoding,
          languageCode: language,
          enableAutomaticPunctuation: true,
        },
        audio: { content: base64 },
      }

      const response = await fetch(
        `https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        }
      )

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Google Speech API STT error:', errorText)
        throw new Error(`Google Speech API error: ${response.status} - ${errorText}`)
      }

      const result = await response.json()
      const transcription = result.results?.[0]?.alternatives?.[0]?.transcript || ''
      const confidence = result.results?.[0]?.alternatives?.[0]?.confidence || 0

      return new Response(
        JSON.stringify({ transcription, confidence, language }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      // Text-to-Speech
      const { text, language = 'en-IN', voice = 'en-IN-Wavenet-A', speakingRate = 1.0, pitch = 0.0 } = body
      if (!text) throw new Error('Text is required for synthesis')

      const requestBody = {
        input: { text },
        voice: { languageCode: language, name: voice },
        audioConfig: { audioEncoding: 'MP3', speakingRate, pitch },
      }

      const response = await fetch(
        `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        }
      )

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Google Speech API TTS error:', errorText)
        throw new Error(`Google Speech API error: ${response.status} - ${errorText}`)
      }

      const result = await response.json()

      return new Response(
        JSON.stringify({
          success: true,
          audioData: `data:audio/mp3;base64,${result.audioContent}`,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
  } catch (error: any) {
    console.error('Google Speech API error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
